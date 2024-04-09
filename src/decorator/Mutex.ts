import {app} from "../app";
import {createActionHandlerDecorator} from "./createActionHandlerDecorator";

/**
 * If specified, the action cannot be entered by other sagas during execution.
 * For error handler action, mutex logic is auto added.
 */
export function Mutex() {
    let lockTime: number | null = null;
    return createActionHandlerDecorator(async function (handler, thisModule) {
        if (lockTime) {
            thisModule.logger.info({
                action: handler.actionName,
                info: {payload: handler.maskedParams},
                stats: {mutex_locked_duration: Date.now() - lockTime},
            });
        } else {
            try {
                const ret = await handler();
                // resolve(app.actionMap, handler.actionName, ret);
            } finally {
                lockTime = null;
            }
        }
    });
}
