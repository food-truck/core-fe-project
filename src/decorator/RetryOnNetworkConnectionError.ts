import {app} from "../app";
import {NetworkConnectionException} from "../Exception";
import {delay} from "../util/taskUtils";
import {createActionHandlerDecorator} from "./createActionHandlerDecorator";

/**
 * Re-execute the action if NetworkConnectionException is thrown.
 * A warning log will be also created, for each retry.
 */
export function RetryOnNetworkConnectionError(retryIntervalSecond: number = 3) {
    return createActionHandlerDecorator(async function (handler) {
        let retryTime = 0;
        // const {resolve} = createPromiseMiddleware();
        while (true) {
            try {
                const ret = await handler();
                // resolve(app.actionMap, handler.actionName, ret);
                break;
            } catch (e) {
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
                    await delay(retryIntervalSecond * 1000);
                } else {
                    throw e;
                }
            }
        }
    });
}
