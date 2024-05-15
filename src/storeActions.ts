import {app} from "./app";
import type {IdleState} from "./sliceStores";

export const setNavigationPrevented = (isPrevented: boolean) =>
    app.store.navigationStore.setState(
        draft => {
            draft.navigationPrevented = isPrevented;
        },
        false,
        "@@framework/navigation-prevention"
    );

export const setIdleTimeout = (timeout: number) =>
    app.store.idle.setState(
        draft => {
            draft.timeout = timeout;
        },
        false,
        "@@framework/idle-timeout"
    );

export const setIdleState = (state: IdleState["state"] = "active") => {
    app.store.idle.setState(
        draft => {
            draft.state = state;
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
    app.store.app.setState(
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
    app.store.loading.setState(
        draft => {
            const count = draft.loading[payload.identifier] || 0;
            draft.loading[payload.identifier] = count + (payload.show ? 1 : -1);
        },
        false,
        "@@framework/loading"
    );
};
