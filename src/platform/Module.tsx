import {produce, enablePatches} from "immer";
import {app} from "../app";
import type {Location} from "history";
import type {TickIntervalDecoratorFlag} from "../module";
import type {Logger} from "../Logger";
import {setAppState, setNavigationPrevented} from "../storeActions";
import {type State} from "../sliceStores";
import {generateUniqueId} from "../util/generateUniqueId";

if (process.env.NODE_ENV === "development") enablePatches();

export type ModuleLocation<State> = Location<Readonly<State> | undefined>;

export interface ModuleLifecycleListener<RouteParam extends object = object, HistoryState extends object = object> {
    onEnter: (entryComponentProps?: any) => void;
    onDestroy: () => void;
    onLocationMatched: (routeParameters: RouteParam, location: ModuleLocation<HistoryState>) => void;
    onPathnameMatched: (routeParameters: RouteParam, location: Location<Readonly<HistoryState> | undefined>) => void;
    onTick: (() => void) & TickIntervalDecoratorFlag;
}

export class Module<RootState extends State, ModuleName extends keyof RootState["app"] & string, RouteParam extends object = object, HistoryState extends object = object>
    implements ModuleLifecycleListener<RouteParam, HistoryState>
{
    constructor(
        readonly name: ModuleName,
        readonly initialState: RootState["app"][ModuleName]
    ) {}

    async executeAsync<T extends any>(asyncFn: (signal: AbortSignal) => Promise<T>, key?: string) {
        const mapKey = key || generateUniqueId();
        const controller = new AbortController();
        if (!app.actionControllers[this.name]) {
            app.actionControllers[this.name] = {};
        }
        app.actionControllers[this.name][mapKey] = controller;

        try {
            const response = await asyncFn(controller.signal);
            return response;
        } catch (error) {
            throw error;
        } finally {
            delete app.actionControllers[this.name][mapKey];
        }
    }

    onEnter(entryComponentProps: any) {
        /**
         * Called when the attached component is initially mounted.
         */
    }

    onDestroy() {
        /**
         * Called when the attached component is going to unmount
         */
    }

    onLocationMatched(routeParam: RouteParam, location: ModuleLocation<HistoryState>) {
        /**
         * Called when the attached component is a React-Route component and its Route location matches
         * It is called each time the location changes, as long as it still matches
         */
    }

    onPathnameMatched(routeParam: RouteParam, location: ModuleLocation<HistoryState>) {
        /**
         * Called when the attached component is a React-Route component and its Route location pathname matches
         * It is called each time the location pathname changes, as long as it still matches
         */
    }

    onTick() {
        /**
         * Called periodically during the lifecycle of attached component
         * Usually used together with @Interval decorator, to specify the period (in second)
         * Attention: The next tick will not be triggered, until the current tick has finished
         */
    }

    get abortControllerMap() {
        return app.actionControllers[this.name];
    }

    get state(): Readonly<RootState["app"][ModuleName]> {
        return app.getState("app")[this.name];
    }

    get rootState(): Readonly<RootState> {
        return app.store.getState() as RootState;
    }

    get logger(): Logger {
        return app.logger;
    }

    setNavigationPrevented(isPrevented: boolean) {
        setNavigationPrevented(isPrevented);
    }

    setState<K extends keyof RootState["app"][ModuleName]>(
        stateOrUpdater: ((state: RootState["app"][ModuleName]) => void) | Pick<RootState["app"][ModuleName], K> | RootState["app"][ModuleName]
    ): void {
        if (typeof stateOrUpdater === "function") {
            const originalState = this.state;
            const updater = stateOrUpdater as (state: RootState["app"][ModuleName]) => void;
            let patchDescriptions: string[] | undefined;
            const newState = produce<Readonly<RootState["app"][ModuleName]>, RootState["app"][ModuleName]>(
                originalState,
                draftState => {
                    // Wrap into a void function, in case updater() might return anything
                    updater(draftState);
                },
                process.env.NODE_ENV === "development"
                    ? patches => {
                          // No need to read "op", in will only be "replace"
                          patchDescriptions = patches.map(_ => _.path.join("."));
                      }
                    : undefined
            );
            if (newState !== originalState) {
                const description = `@@${this.name}/setState${patchDescriptions ? `[${patchDescriptions.join("/")}]` : ``}`;
                setAppState(
                    {
                        moduleName: this.name,
                        state: newState,
                    },
                    description
                );
            }
        } else {
            const partialState = stateOrUpdater as object;
            this.setState((state: object) => Object.assign(state, partialState));
        }
    }

    /**
     * CAVEAT:
     * (1)
     * Calling this.pushHistory to other module should cancel the following logic.
     * Using store.dispatch here will lead to error while cancelling in lifecycle.
     *
     * Because the whole process is in sync mode:
     * dispatch push action -> location change -> router component will un-mount -> lifecycle saga cancel
     *
     * Cancelling the current sync-running saga will throw "TypeError: Generator is already executing".
     *
     * (2)
     * Adding yield cancel() in pushHistory is also incorrect.
     * If this.pushHistory is only to change state rather than URL, it will lead to the whole lifecycle saga cancelled.
     *
     * https://github.com/react-boilerplate/react-boilerplate/issues/1281
     */
    pushHistory(url: string): void;
    pushHistory(url: string, stateMode: "keep-state"): void;
    pushHistory<T extends object>(url: string, state: T): void; // Recommended explicitly pass the generic type
    pushHistory(state: HistoryState): void;

    pushHistory(urlOrState: HistoryState | string, state?: object | "keep-state"): void {
        // TODO 每行都待验证
        if (typeof urlOrState === "string") {
            const url: string = urlOrState;
            if (state === "keep-state") {
                history.pushState(app.history.location.state, "", url);
            }
            if (state) {
                history.pushState(state, "", url);
            } else {
                history.pushState({}, "", url);
            }
        } else {
            const currentURL = location.pathname + location.search;
            const state: HistoryState = urlOrState;
            history.pushState(state, "", currentURL);
        }
    }
}
