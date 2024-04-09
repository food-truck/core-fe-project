import {type State} from "../sliceStores";
import {useSelector} from "../platform/bootstrap";

export function useLoadingStatus(identifier: string = "global"): boolean {
    return useSelector((state: State) => state.loading[identifier] > 0);
}
