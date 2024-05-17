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
