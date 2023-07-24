import {NetworkConnectionException} from "../Exception";
import {createActionHandlerDecorator} from "./createActionHandlerDecorator";
import {app} from "../app";
import createPromiseMiddleware from "../createPromiseMiddleware";

/**
 * Do nothing (only create a warning log) if NetworkConnectionException is thrown.
 * Mainly used for background tasks.
 */
export function SilentOnNetworkConnectionError() {
    return createActionHandlerDecorator(function* (handler) {
        const {resolve} = createPromiseMiddleware();
        try {
            const ret = yield* handler();
            resolve(app.actionMap, handler.actionName, ret);
        } catch (e) {
            if (e instanceof NetworkConnectionException) {
                app.logger.exception(
                    e,
                    {
                        payload: handler.maskedParams,
                        process_method: "silent",
                    },
                    handler.actionName
                );
            } else {
                throw e;
            }
        }
    });
}
