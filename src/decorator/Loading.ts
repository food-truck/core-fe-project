import {put} from "redux-saga/effects";
import {createActionHandlerDecorator} from "./index";
import {loadingAction} from "../reducer";
import createPromiseMiddleware from "../createPromiseMiddleware";
import {app} from "../app";

/**
 * To mark state.loading[identifier] during action execution.
 */
export function Loading(identifier: string = "global") {
    return createActionHandlerDecorator(function* (handler) {
        const {resolve, reject} = createPromiseMiddleware();
        try {
            yield put(loadingAction(true, identifier));
            const ret = yield* handler();
            resolve(app.actionMap, handler.actionName, ret);
        } catch (err) {
            yield put(loadingAction(false, identifier));
            reject(app.actionMap, handler.actionName, err);
        } finally {
            yield put(loadingAction(false, identifier));
        }
    });
}
