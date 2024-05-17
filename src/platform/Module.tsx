import {enablePatches} from "immer";
import {app} from "../app";
import type {Location} from "history";
import type {TickIntervalDecoratorFlag} from "../module";
import type {Logger} from "../Logger";
import {setNavigationPrevented} from "../storeActions";
import {CoreModule} from "@wonder/core-core";
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
    extends CoreModule<RootState, ModuleName>
    implements ModuleLifecycleListener<RouteParam, HistoryState>
{
    async executeAsync<T>(asyncFn: (signal: AbortSignal) => Promise<T>, key?: string) {
        const mapKey = key || generateUniqueId();
        const controller = new AbortController();
        if (!app.actionControllers[this.name]) {
            app.actionControllers[this.name] = {};
        }
        app.actionControllers[this.name][mapKey] = controller;

        try {
            return await asyncFn(controller.signal);
        } finally {
            delete app.actionControllers[this.name][mapKey];
        }
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

    get logger(): Logger {
        return app.logger;
    }

    setNavigationPrevented(isPrevented: boolean) {
        setNavigationPrevented(isPrevented);
    }
}
