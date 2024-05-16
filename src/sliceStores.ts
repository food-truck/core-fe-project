import {type Location, type Action, createBrowserHistory} from "history";
import {create, type StateCreator, type StoreMutatorIdentifier, type UseBoundStore} from "zustand";
import {immer} from "zustand/middleware/immer";
import { immer as immerMiddleWare } from "zustand/middleware/immer";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { DEFAULT_IDLE_TIMEOUT } from "./util/IdleDetector";


export const broswerHistory = createBrowserHistory();

export type ImmerStateCreator<T, Mps extends [StoreMutatorIdentifier, unknown][] = [], Mcs extends [StoreMutatorIdentifier, unknown][] = []> = StateCreator<T, [...Mps, ["zustand/immer", never]], Mcs>;

export const createStore = <T extends object>(creater: ImmerStateCreator<T>) => create<T>()(subscribeWithSelector(immerMiddleWare(devtools(creater))));

export interface LoadingState {
    [key: string]: any;
}

export interface NavigationState {
    navigationPrevented: boolean;
}

export interface IdleState {
    timeout: number;
    state: "active" | "idle";
}

export interface AppState {
    [module: string]: any;
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

export type StoreType = ReturnType<typeof createStore>;


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
    navigationStore: navigationStore,
    idle: idleStore,
};
