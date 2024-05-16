import {app} from "./app";
import type {IdleState, RouterState} from "./sliceStores";

export const setRouterState = (payload: RouterState) => {
    app.store.router.setState(
        draft => {
            draft.action = payload.action;
            draft.location = payload.location;
        },
        false,
        "@@framework/router"
    );
};

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
            draft[payload.moduleName] = payload.state;
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
            const count = draft[payload.identifier] || 0;
            draft[payload.identifier] = count + (payload.show ? 1 : -1);
        },
        false,
        "@@framework/loading"
    );
};
