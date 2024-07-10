import {eventBus, createActionHandlerDecorator, type ActionHandlerWithMetaData} from "@wonder/core-core";

export function EmitEventBefore<ReturnType>(customEventName: string) {
    return createActionHandlerDecorator(async function (handler: ActionHandlerWithMetaData<ReturnType>) {
        eventBus.emit(customEventName, {
            detail: {
                actionName: handler.actionName ?? handler.name,
                maskedParams: handler.maskedParams,
            },
        });
        return await handler();
    });
}

export function EmitEventAfter<ReturnType>(customEventName: string) {
    return createActionHandlerDecorator(async function (handler: ActionHandlerWithMetaData<ReturnType>) {
        try {
            return await handler();
        } finally {
            eventBus.emit(customEventName, {
                detail: {
                    actionName: handler.actionName ?? handler.name,
                    maskedParams: handler.maskedParams,
                },
            });
        }
    });
}

export function EmitEventOnError<ReturnType>(customEventName: string) {
    return createActionHandlerDecorator(async function (handler: ActionHandlerWithMetaData<ReturnType>) {
        try {
            return await handler();
        } catch (error: any) {
            eventBus.emit(customEventName, {
                detail: {
                    actionName: handler.actionName ?? handler.name,
                    maskedParams: handler.maskedParams,
                    error,
                },
            });
            throw error;
        }
    });
}
