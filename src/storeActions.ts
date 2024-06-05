import {app} from "./app";
import type {IdleState, RouterState} from "./sliceStores";

export const setRouterNavigateState = (payload: RouterState["navigate"]) => {
    app.store.router.setState(
        draft => {
            draft.navigate = payload;
        },
        false,
        "@@framework/router"
    );
};
export const setRouterState = (payload: Omit<RouterState, "navigate">) => {
    app.store.router.setState(
        draft => {
            draft.action = payload.action;
            draft.location = payload.location;
        },
        false,
        "@@framework/router"
    );
};

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
