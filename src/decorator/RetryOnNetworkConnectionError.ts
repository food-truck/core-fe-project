import {app} from "../app";
import {NetworkConnectionException} from "../Exception";
import {delay} from "redux-saga/effects";
import {createActionHandlerDecorator} from "./index";
import createPromiseMiddleware from "../createPromiseMiddleware";

/**
 * Re-execute the action if NetworkConnectionException is thrown.
 * A warning log will be also created, for each retry.
 */
export function RetryOnNetworkConnectionError(retryIntervalSecond: number = 3) {
    return createActionHandlerDecorator(function* (handler) {
        let retryTime = 0;
        const {resolve, reject} = createPromiseMiddleware();
        while (true) {
            try {
                const ret = yield* handler();
                resolve(app.actionMap, handler.actionName, ret);
                break;
            } catch (e) {
                reject(app.actionMap, handler.actionName, e);
                if (e instanceof NetworkConnectionException) {
                    retryTime++;
                    app.logger.exception(
                        e,
                        {
                            payload: handler.maskedParams,
                            process_method: `will retry #${retryTime}`,
                        },
                        handler.actionName
                    );
                    yield delay(retryIntervalSecond * 1000);
                } else {
                    throw e;
                }
            }
        }
    });
}
