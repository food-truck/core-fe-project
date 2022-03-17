import {put} from "redux-saga/effects";
import {createActionHandlerDecorator} from "./index";
import {loadingAction} from "../reducer";
import createPromiseMiddleware, {map} from "../createPromiseMiddleware";

/**
 * To mark state.loading[identifier] during action execution.
 */
export function Loading(identifier: string = "global") {
    return createActionHandlerDecorator(function* (handler) {
        const {resolve, reject} = createPromiseMiddleware();
        try {
            yield put(loadingAction(true, identifier));
            const ret = yield* handler();
            resolve(map, handler.actionName, ret);
        } catch (err) {
            yield put(loadingAction(false, identifier));
            reject(map, handler.actionName, err);
        } finally {
            yield put(loadingAction(false, identifier));
        }
    });
}
