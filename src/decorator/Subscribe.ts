import {app} from "../app";
import type {Module} from "../platform/Module";
import {shallow} from "zustand/shallow";
import type {RootState} from "../type/state";

/**
 * Subscribe decorator for subscribing to changes in the application state. When the decorated method is called, the subscription is unsubscribed.
 *
 * A function that selects the desired part(s) of the state to subscribe to. It can be a single selector function or an array of selector functions.
 * @param selector selector: state => state.app.xxx  or state => [state.app.xxx, state.app.yyy]
 *
 */
export function Subscribe<M extends Module<any, any>, T extends any>(selector: (state: RootState) => any) {
    let unsubscribe: () => void;
    return (originMethod: any, _context: ClassMethodDecoratorContext<M, (value: T, prevValue: T) => void>) => {
        _context.addInitializer(function () {
            unsubscribe = app.store.subscribe(
                selector,
                (value, prevValue) => {
                    try {
                        originMethod.call(this, value, prevValue);
                    } catch (err) {
                        throw err;
                    }
                },
                {equalityFn: shallow}
            );
        });

        return () => {
            unsubscribe();
        };
    };
}
