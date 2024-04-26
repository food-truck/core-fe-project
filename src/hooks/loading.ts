import {type State} from "../sliceStores";
import {useSelector} from "./action";

export function useLoadingStatus(identifier: string = "global"): boolean {
    return useSelector((state: State) => state.loading[identifier] > 0);
}
