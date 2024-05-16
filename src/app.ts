import {  type History } from "history";
import { type Logger, type LoggerConfig, LoggerImpl } from "./Logger";
import { broswerHistory, store, type State } from "./sliceStores";
import type { ErrorHandler } from "./module";
import { coreApp } from "@wonder/core-core";

interface App {
    readonly history: History;
    readonly store: typeof store & typeof coreApp.store,
    readonly logger: LoggerImpl;
    loggerConfig: LoggerConfig | null;
    errorHandler: ErrorHandler;
    getState: <K extends keyof State>(key: K) => State[K];
    // We will temporarily store the asynchronous controllers handled by the module.executeAsync method here, where the user can cancel any outstanding asynchronous operations.
    actionControllers: Record<string, Record<string, AbortController>>;
}

export const app = createApp();
export const logger: Logger = app.logger;

function createApp(): App {
    const combineStore = Object.assign(coreApp.store, store);

    return {
        getState: <K extends keyof State>(key: K) => combineStore[key].getState() as State[K],
        history: broswerHistory,
        store: combineStore,
        logger: new LoggerImpl(),
        loggerConfig: null,
        errorHandler() {},
        actionControllers: {},
    };
}
