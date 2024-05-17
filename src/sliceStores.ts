import {type Location, type Action, createBrowserHistory} from "history";
import {DEFAULT_IDLE_TIMEOUT} from "./util/IdleDetector";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {devtools, subscribeWithSelector} from "zustand/middleware";
import type {AppState, ImmerStateCreator, LoadingState} from "@wonder/core-core/lib/sliceStores";

export const broswerHistory = createBrowserHistory();

export const createStore = <T extends object>(creater: ImmerStateCreator<T>) => create<T>()(subscribeWithSelector(immer(devtools(creater))));
export type StoreType = ReturnType<typeof createStore>;

export interface NavigationState {
    navigationPrevented: boolean;
}

export interface IdleState {
    timeout: number;
    state: "active" | "idle";
}

export interface RouterState {
    location: Location;
    action: Action;
}

export interface State {
    app: AppState;
    router: RouterState;
    idle: IdleState;
    navigationStore: NavigationState;
    loading: LoadingState;
}

const routerStore = createStore<RouterState>(() => ({
    location: broswerHistory.location,
    action: broswerHistory.action,
}));

const navigationStore = createStore<NavigationState>(() => ({
    navigationPrevented: false,
}));

const idleStore = createStore<IdleState>(() => ({
    timeout: DEFAULT_IDLE_TIMEOUT,
    state: "active",
}));

export const store = {
    router: routerStore,
    navigationStore,
    idle: idleStore,
};
