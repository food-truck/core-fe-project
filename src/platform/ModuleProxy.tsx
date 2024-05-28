import React from "react";
import {app} from "../app";
import {executeAction} from "../module";
import {Module, type ModuleLifecycleListener} from "./Module";
import type {Location} from "history";
import {useMatch} from "react-router-dom";
import {setNavigationPrevented} from "../storeActions";
import {CoreModuleProxy} from "@wonder/core-core";
import type {RouterState} from "../sliceStores";

type RouteComponentProps = RouterState & {match: ReturnType<typeof useMatch>};
let startupModuleName: string | null = null;

export class ModuleProxy<M extends Module<any, any>> extends CoreModuleProxy<M> {
    attachLifecycle<P extends object>(ComponentType: React.ComponentType<P>): React.ComponentType<P> {
        const moduleName = this.module.name as string;
        const module = this.module;
        const lifecycleListener = this.module as ModuleLifecycleListener;
        const modulePrototype = Object.getPrototypeOf(lifecycleListener);
        const actions = this.actions as any;

        return class extends React.PureComponent<P> {
            static displayName = `Module[${moduleName}]`;
            private timer: number | NodeJS.Timeout = -1;
            private tickCount: number = 0;
            private mountedTime: number = Date.now();

            constructor(props: P) {
                super(props);
                if (!startupModuleName) {
                    startupModuleName = moduleName;
                }
            }

            override componentDidMount() {
                this.lifecycle.call(this);
            }

            override async componentDidUpdate(prevProps: Readonly<P>) {
                const prevLocation = (prevProps as any).location;
                const props = this.props as RouteComponentProps & P;
                const currentLocation = props.location;
                const currentRouteParams = props.match ? props.match.params : null;

                /**
                 * Only trigger onLocationMatched if current component is connected to <Route>, and location literally changed.
                 *
                 * CAVEAT:
                 *  Do not use !== to compare locations.
                 *  Because in "connected-react-router", location from rootState.router.location is not equal to current history.location in reference.
                 */
                if (currentLocation && currentRouteParams && !this.areLocationsPathNameEqual(currentLocation, prevLocation) && this.hasOwnLifecycle("onPathnameMatched")) {
                    const action = `${moduleName}/@@PATHNAME_MATCHED`;
                    const startTime = Date.now();

                    executeAction({
                        actionName: action,
                        handler: lifecycleListener.onPathnameMatched.bind(lifecycleListener),
                        payload: [currentRouteParams, currentLocation],
                    });
                    app.logger.info({
                        action,
                        elapsedTime: Date.now() - startTime,
                        info: {
                            // URL params should not contain any sensitive or complicated objects
                            route_params: JSON.stringify(currentRouteParams),
                            history_state: JSON.stringify(currentLocation.state),
                        },
                    });
                    setNavigationPrevented(false);
                }

                /**
                 * Only trigger onLocationMatched if current component is connected to <Route>, and location literally changed.
                 *
                 * CAVEAT:
                 *  Do not use !== to compare locations.
                 *  Because in "connected-react-router", location from rootState.router.location is not equal to current history.location in reference.
                 */
                if (currentLocation && currentRouteParams && !this.areLocationsEqual(currentLocation, prevLocation) && this.hasOwnLifecycle("onLocationMatched")) {
                    const action = `${moduleName}/@@LOCATION_MATCHED`;
                    const startTime = Date.now();

                    executeAction({
                        actionName: action,
                        handler: lifecycleListener.onLocationMatched.bind(lifecycleListener),
                        payload: [currentRouteParams, currentLocation],
                    });
                    app.logger.info({
                        action,
                        elapsedTime: Date.now() - startTime,
                        info: {
                            // URL params should not contain any sensitive or complicated objects
                            route_params: JSON.stringify(currentRouteParams),
                            history_state: JSON.stringify(currentLocation.state),
                        },
                    });

                    setNavigationPrevented(false);
                }
            }

            override componentWillUnmount() {
                if (this.hasOwnLifecycle("onDestroy")) {
                    actions.onDestroy();
                }

                const currentLocation = (this.props as any).location;
                if (currentLocation) {
                    setNavigationPrevented(false);
                }

                Object.entries(app.actionControllers).forEach(([actionModuleName, actionControllersMap]) => {
                    if (actionModuleName === moduleName) {
                        Object.values(actionControllersMap).forEach(control => control.abort());
                    }
                });

                //clearTimer
                clearInterval(this.timer);

                app.logger.info({
                    action: `${moduleName}/@@DESTROY`,
                    stats: {
                        tick_count: this.tickCount,
                        staying_second: (Date.now() - this.mountedTime) / 1000,
                    },
                });
            }

            override render() {
                return <ComponentType {...this.props} />;
            }

            private areLocationsEqual = (a: Location, b: Location): boolean => {
                return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && a.state === b.state;
            };

            private areLocationsPathNameEqual = (a: Location, b: Location): boolean => {
                return a.pathname === b.pathname;
            };

            private hasOwnLifecycle = (methodName: keyof ModuleLifecycleListener): boolean => {
                return Object.prototype.hasOwnProperty.call(modulePrototype, methodName);
            };

            private async lifecycle() {
                const props = this.props as RouteComponentProps & P;

                const enterActionName = `${moduleName}/@@ENTER`;
                const startTime = Date.now();

                executeAction({
                    actionName: enterActionName,
                    handler: lifecycleListener.onEnter.bind(lifecycleListener),
                    payload: [props],
                });

                app.logger.info({
                    action: enterActionName,
                    elapsedTime: Date.now() - startTime,
                    info: {
                        component_props: JSON.stringify(props),
                    },
                });

                if (this.hasOwnLifecycle("onPathnameMatched")) {
                    if ("match" in props && "location" in props) {
                        const initialRenderActionName = `${moduleName}/@@PATHNAME_MATCHED`;
                        const startTime = Date.now();
                        const routeParams = props.match?.params;
                        executeAction({
                            actionName: initialRenderActionName,
                            handler: lifecycleListener.onPathnameMatched.bind(lifecycleListener),
                            payload: [routeParams, props.location],
                        });
                        app.logger.info({
                            action: initialRenderActionName,
                            elapsedTime: Date.now() - startTime,
                            info: {
                                route_params: JSON.stringify(props.match?.params),
                                history_state: JSON.stringify(props.location.state),
                            },
                        });
                    } else {
                        console.error(`[framework] Module component [${moduleName}] is non-route, use onEnter() instead of onPathnameMatched()`);
                    }
                }

                if (this.hasOwnLifecycle("onLocationMatched")) {
                    if ("match" in props && "location" in props) {
                        const initialRenderActionName = `${moduleName}/@@LOCATION_MATCHED`;
                        const startTime = Date.now();
                        const routeParams = props.match?.params;
                        executeAction({
                            actionName: initialRenderActionName,
                            handler: lifecycleListener.onLocationMatched.bind(lifecycleListener),
                            payload: [routeParams, props.location],
                        });
                        app.logger.info({
                            action: initialRenderActionName,
                            elapsedTime: Date.now() - startTime,
                            info: {
                                route_params: JSON.stringify(props.match?.params),
                                history_state: JSON.stringify(props.location.state),
                            },
                        });
                    } else {
                        console.error(`[framework] Module component [${moduleName}] is non-route, use onEnter() instead of onLocationMatched()`);
                    }
                }

                if (moduleName === startupModuleName) {
                    createStartupPerformanceLog(`${moduleName}/@@STARTUP_PERF`);
                }

                if (this.hasOwnLifecycle("onTick")) {
                    this.onTickWatcher.call(this);
                }
            }

            private async onTickWatcher() {
                this.onTickTask.call(this);
                // This technique is not recommended for adding state in React Server Components (typically in Next.js 13 and above).
                // It can lead to unexpected bugs and privacy issues for your users.
                // For more details, see https://github.com/pmndrs/zustand/discussions/2200
                app.store.idle.subscribe(
                    state => state.state,
                    (idleState, preIdleState) => {
                        if (preIdleState !== idleState) {
                            clearInterval(this.timer);
                            const isActive = idleState === "active";
                            if (isActive) {
                                this.onTickTask();
                            }
                        }
                    }
                );
            }

            private async onTickTask() {
                const tickIntervalInMillisecond = (lifecycleListener.onTick.tickInterval || 5) * 1000;
                const boundTicker = lifecycleListener.onTick.bind(lifecycleListener);
                const tickActionName = `${moduleName}/@@TICK`;
                const tickExecute = async () => {
                    await executeAction({
                        actionName: tickActionName,
                        handler: boundTicker,
                        payload: [],
                    });
                    this.tickCount++;
                };
                tickExecute();
                clearInterval(this.timer);
                this.timer = setInterval(tickExecute, tickIntervalInMillisecond);
            }
        };
    }
}

function createStartupPerformanceLog(actionName: string): void {
    // TODO: use new API
    if (window.performance && performance.timing) {
        // For performance timing API, please refer: https://www.w3.org/blog/2012/09/performance-timing-information/
        const now = Date.now();
        const perfTiming = performance.timing;
        const baseTime = perfTiming.navigationStart;
        const duration = now - baseTime;
        const stats: {[key: string]: number} = {};

        const createStat = (key: string, timeStamp: number) => {
            if (timeStamp >= baseTime) {
                stats[key] = timeStamp - baseTime;
            }
        };

        createStat("http_start", perfTiming.requestStart);
        createStat("http_end", perfTiming.responseEnd);
        createStat("dom_start", perfTiming.domLoading);
        createStat("dom_content", perfTiming.domContentLoadedEventEnd); // Mostly same time with domContentLoadedEventStart
        createStat("dom_end", perfTiming.loadEventEnd); // Mostly same with domComplete/loadEventStart

        const slowStartupThreshold = app.loggerConfig?.slowStartupThresholdInSecond || 5;
        if (duration / 1000 >= slowStartupThreshold) {
            app.logger.warn({
                action: actionName,
                elapsedTime: duration,
                stats,
                errorCode: "SLOW_STARTUP",
                errorMessage: `Startup took ${(duration / 1000).toFixed(2)} sec, longer than ${slowStartupThreshold}`,
            });
        } else {
            app.logger.info({
                action: actionName,
                elapsedTime: duration,
                stats,
            });
        }
    }
}
