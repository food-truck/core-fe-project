import {app} from "../app";
import {type State} from "../sliceStores";
import {useSelector} from "./action";

export function useLoadingStatus(identifier: string = "global"): boolean {
    return app.store.loading(state => state[identifier] > 0);
}
