import {app} from "./app";
import {ModuleProxy} from "./platform/ModuleProxy";
import {captureError} from "./util/error-util";
import {stringifyWithMask, Exception, coreRegister, executeActionGenerator} from "@wonder/core-core";

export interface TickIntervalDecoratorFlag {
    tickInterval?: number;
}

export type ErrorHandler = (error: Exception) => void;

export interface ErrorListener {
    onError: ErrorHandler;
}

export type ActionHandler<ReturnType> = (...args: any[]) => Promise<ReturnType>;

export const executeAction = executeActionGenerator(captureError);

export const register = coreRegister(ModuleProxy<any>, executeAction);
