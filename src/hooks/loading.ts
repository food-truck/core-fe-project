import {app} from "../app";

export function useLoadingStatus(identifier: string = "global"): boolean {
    return app.store.loading(state => state[identifier] > 0);
}
