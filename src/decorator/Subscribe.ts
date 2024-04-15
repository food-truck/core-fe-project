import {app} from "../app";
import type {Module} from "../platform/Module";
import {shallow} from "zustand/shallow";
import type {RootState} from "../type/state";

/**
 * selector: state => state.app.xxx  or state =>
 */
export function Subscribe<M extends Module<any, any>, T extends any>(selector: (state: RootState) => any) {
    return (originMethod: any, _context: ClassMethodDecoratorContext<M, (value: T, prevValue: T) => void>): any => {
        _context.addInitializer(function () {
            app.store.subscribe(
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

        return () => {};
    };
}
