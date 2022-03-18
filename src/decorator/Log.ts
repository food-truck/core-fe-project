import {app} from "../app";
import createPromiseMiddleware from "../createPromiseMiddleware";
import {createActionHandlerDecorator} from "./index";

/**
 * To add a log item for action, with execution duration, action name, and masked action parameters.
 */
export function Log() {
    return createActionHandlerDecorator(function* (handler, thisModule) {
        const startTime = Date.now();
        const {resolve, reject} = createPromiseMiddleware();
        try {
            const ret = yield* handler();
            resolve(app.actionMap, handler.actionName, ret);
        } catch (err) {
            reject(app.actionMap, handler.actionName, err);
        } finally {
            thisModule.logger.info({
                action: handler.actionName,
                elapsedTime: Date.now() - startTime,
                info: {payload: handler.maskedParams},
            });
        }
    });
}
