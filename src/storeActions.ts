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
