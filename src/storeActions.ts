import {app} from "./app";
import type {IdleSlice} from "./sliceStores";

export const setNavigationPrevented = (isPrevented: boolean) =>
    app.store.setState(
        draft => {
            draft.navigationPrevented = isPrevented;
        },
        false,
        "@@framework/navigation-prevention"
    );

export const setIdleTimeout = (timeout: number) =>
    app.store.setState(
        draft => {
            draft.idle.timeout = timeout;
        },
        false,
        "@@framework/idle-timeout"
    );

export const setIdleState = (state: IdleSlice["idle"]["state"] = "active") => {
    app.store.setState(
        draft => {
            draft.idle.state = state;
        },
        false,
        "@@framework/idle-state"
    );
};

interface SetStatePayload<T = any> {
    moduleName: string;
    state: T;
}

export const setAppState = <T = any>(payload: SetStatePayload<T>, actionName?: string) => {
    app.store.setState(
        draft => {
            draft.app[payload.moduleName] = payload.state;
        },
        false,
        actionName || "@@framework/setState"
    );
};

interface LoadingActionPayload {
    identifier: string;
    show: boolean;
}

export const setLoadingState = (payload: LoadingActionPayload) => {
    app.store.setState(
        draft => {
            const count = draft.loading[payload.identifier] || 0;
            draft.loading[payload.identifier] = count + (payload.show ? 1 : -1);
        },
        false,
        "@@framework/loading"
    );
};
