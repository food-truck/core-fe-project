import type {State} from "../sliceStores";
import {useContext} from "react";
import {ZustandContext} from "../ZustandProvider";

export const useSelector = (selector: (state: State) => any) => {
    if (!ZustandContext) return null;
    const store = useContext(ZustandContext);
    return store(selector);
};
