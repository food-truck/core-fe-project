import {createActionHandlerDecorator} from "./createActionHandlerDecorator";
import {put} from "redux-saga/effects";
import {loadingAction} from "../reducer";
import createPromiseMiddleware from "../createPromiseMiddleware";
import {app} from "../app";

/**
 * To mark state.loading[identifier] during action execution.
 */
export function Loading(identifier: string = "global") {
    return createActionHandlerDecorator(function* (handler) {
        const {resolve} = createPromiseMiddleware();
        try {
            yield put(loadingAction(true, identifier));
            const ret = yield* handler();
            resolve(app.actionMap, handler.actionName, ret);
        } finally {
            yield put(loadingAction(false, identifier));
        }
    });
}
