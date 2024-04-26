import {useSelector} from "../src/hooks/action";
import {RootState} from "./type/state";
import {useMemo} from "react";

export const useModuleState = <T extends keyof RootState["app"]>(moduleStateName: T): RootState["app"][T] => {
    const state = useSelector(state => (state.app as RootState["app"])[moduleStateName]);

    return useMemo(() => state ?? {}, [state]);
};
