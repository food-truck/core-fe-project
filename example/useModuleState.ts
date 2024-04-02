import { useStore } from "../src";
import { RootState } from "./type/state";
import { useMemo } from "react";

export const useModuleState = <T extends keyof RootState["app"]>(moduleStateName: T): RootState["app"][T] => {
    const state = useStore((state) => (state.app as RootState["app"])[moduleStateName]);

    return useMemo(() => state ?? {}, [state]);
};