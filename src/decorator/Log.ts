import {app} from "../app";
import createPromiseMiddleware from "../createPromiseMiddleware";
import {createActionHandlerDecorator} from "./createActionHandlerDecorator";

/**
 * To add a log item for action, with execution duration, action name, and masked action parameters.
 */
export function Log() {
    return createActionHandlerDecorator(function* (handler, thisModule) {
        const startTime = Date.now();
        const {resolve} = createPromiseMiddleware();
        try {
            const ret = yield* handler();
            resolve(app.actionMap, handler.actionName, ret);
        } finally {
            thisModule.logger.info({
                action: handler.actionName,
                elapsedTime: Date.now() - startTime,
                info: {payload: handler.maskedParams},
            });
        }
    });
}
