import {type Location, createBrowserRouter} from "react-router-dom";
import {DEFAULT_IDLE_TIMEOUT} from "./util/IdleDetector";
import {createStore} from "@wonder/core-core";
import type {AppState, LoadingState} from "@wonder/core-core/lib/sliceStores";

export type StoreType = ReturnType<typeof createStore>;
export type BrowserRouterType = ReturnType<typeof createBrowserRouter>;

export interface IdleState {
    timeout: number;
    state: "active" | "idle";
}

export interface RouterState {
    location: Location | null;
    action: BrowserRouterType["state"]["historyAction"] | null;
    navigate: BrowserRouterType["navigate"] | null;
}

export interface State {
    app: AppState;
    router: RouterState;
    idle: IdleState;
    loading: LoadingState;
}

const routerStore = createStore<RouterState>(() => ({
    location: null,
    action: null,
    navigate: null,
}));

const idleStore = createStore<IdleState>(() => ({
    timeout: DEFAULT_IDLE_TIMEOUT,
    state: "active",
}));

export const store = {
    router: routerStore,
    idle: idleStore,
};
