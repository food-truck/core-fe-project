import {setLoadingState, createActionHandlerDecorator, type ActionHandlerWithMetaData} from "@wonder/core-core";

/**
 * To mark state.loading[identifier] during action execution.
 */
export function Loading<ReturnType>(identifier: string = "global") {
    return createActionHandlerDecorator(async function (handler: ActionHandlerWithMetaData<ReturnType>) {
        setLoadingState({
            identifier,
            show: true,
        });
        try {
            return await handler();
        } finally {
            setLoadingState({
                identifier,
                show: false,
            });
        }
    });
}
