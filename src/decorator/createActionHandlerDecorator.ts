import {app} from "../app";
import {stringifyWithMask} from "../util/json-util";
import type {State} from "../sliceStores";
import type {ActionHandler} from "../module";
import type {Module} from "../platform/Module";

type ActionHandlerWithMetaData = ActionHandler & {actionName: string; maskedParams: string};

type HandlerInterceptor<RootState extends State = State> = (handler: ActionHandlerWithMetaData, thisModule: Module<RootState, any>) => Promise<unknown>;

/**
 * A helper for ActionHandler functions (Saga).
 */
export function createActionHandlerDecorator<
    RootState extends State = State,
    This extends Module<RootState, string> = Module<RootState, string>,
    Fn extends (this: This, ...args: any[]) => Promise<void> = ActionHandler,
>(interceptor: HandlerInterceptor<RootState>) {
    return (fn: Fn, context: ClassMethodDecoratorContext<This, Fn>) => {
        return async function (this: This, ...args: any[]): Promise<void> {
            const boundFn: ActionHandlerWithMetaData = fn.bind(this, ...args) as any;
            // Do not use fn.actionName, it returns undefined
            // The reason is, fn is created before module register(), and the actionName had not been attached then
            boundFn.actionName = (this as any)[context.name].actionName;
            boundFn.maskedParams = stringifyWithMask(app.loggerConfig?.maskedKeywords || [], "***", ...args) || "[No Parameter]";
            const userCustomReturn = await interceptor(boundFn, this as any);
            // let users can custom define descriptor' return
            // if (userCustomReturn && typeof userCustomReturn === "object") {
            //     // const {resolve, reject} = createPromiseMiddleware();
            //     const {isResolve, isReject, resolveValue, rejectValue} = userCustomReturn;
            //     if (isResolve) {
            //         // resolve(app.actionMap, boundFn.actionName, resolveValue);
            //     }
            //     if (isReject) {
            //         // reject(app.actionMap, boundFn.actionName, rejectValue);
            //     }
            // }
        };
    };
}
