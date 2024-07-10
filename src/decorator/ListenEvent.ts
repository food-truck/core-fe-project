import type {Module} from "../platform/Module";
import {eventBus} from "@wonder/core-core";

export function ListenEvent<T, M extends Module<any, any>>(customEventName: string, listenType: "on" | "once") {
    let unlisten: () => void;
    return (originMethod: any, _context: ClassMethodDecoratorContext<M, (value: T, prevValue: T) => void>) => {
        _context.addInitializer(function () {
            const callback = (detail: any) => {
                originMethod.call(this, detail);
            };
            eventBus[listenType](customEventName, callback);
            unlisten = () => {
                eventBus.off(customEventName, callback);
            };
        });

        const newFunction = () => {
            unlisten();
        };

        Reflect.defineProperty(newFunction, "name", {
            value: _context.name,
        });
        return newFunction as any;
    };
}
