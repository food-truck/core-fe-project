import {type Logger, type LoggerConfig, LoggerImpl, coreApp, ON_REGISTER_EVENT} from "@wonder/core-core";
import {store, type State} from "./sliceStores";
import type {ErrorHandler} from "./module";
import type {To, NavigateOptions} from "react-router-dom";

interface App {
    readonly store: typeof store & typeof coreApp.store;
    readonly logger: LoggerImpl;
    loggerConfig: LoggerConfig | null;
    errorHandler: ErrorHandler;
    getState: <K extends keyof State>(key: K) => State[K];
    // We will temporarily store the asynchronous controllers handled by the module.executeAsync method here, where the user can cancel any outstanding asynchronous operations.
    actionControllers: Record<string, Record<string, AbortController>>;
    navigate: (to: To, opt?: NavigateOptions) => Promise<void> | ((to: number) => Promise<void>);
}

export const app = createApp();
export const logger: Logger = app.logger;

function createApp(): App {
    const combineStore = Object.assign(coreApp.store, store);

    return {
        getState: <K extends keyof State>(key: K) => combineStore[key].getState() as State[K],
        store: combineStore,
        logger: new LoggerImpl(),
        loggerConfig: null,
        errorHandler() {},
        actionControllers: {},
        navigate: () => new Promise<void>(() => {}),
    };
}
