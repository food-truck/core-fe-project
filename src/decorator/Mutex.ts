import {app} from "../app";
import createPromiseMiddleware from "../createPromiseMiddleware";
import {createActionHandlerDecorator} from "./index";

/**
 * If specified, the action cannot be entered by other sagas during execution.
 * For error handler action, mutex logic is auto added.
 */
export function Mutex() {
    let lockTime: number | null = null;
    return createActionHandlerDecorator(function* (handler, thisModule) {
        if (lockTime) {
            thisModule.logger.info({
                action: handler.actionName,
                info: {
                    payload: handler.maskedParams,
                    mutex_locked_duration: (Date.now() - lockTime).toString(),
                },
            });
        } else {
            const {resolve, reject} = createPromiseMiddleware();
            try {
                const ret = yield* handler();
                resolve(app.actionMap, handler.actionName, ret);
            } catch (err) {
                reject(app.actionMap, handler.actionName, err);
                throw err;
            } finally {
                lockTime = null;
            }
        }
    });
}
