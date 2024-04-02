import {type History, type Location, type Action} from "history";
import {create, type StateCreator, type StoreMutatorIdentifier} from "zustand";
import {immer} from "zustand/middleware/immer";
import {devtools} from "zustand/middleware";
import {DEFAULT_IDLE_TIMEOUT} from "./util/IdleDetector";

export type ImmerStateCreator<T, Mps extends [StoreMutatorIdentifier, unknown][] = [], Mcs extends [StoreMutatorIdentifier, unknown][] = []> = StateCreator<T, [...Mps, ["zustand/immer", never]], Mcs>;
export interface Slice {}

export interface RouterSlice extends Slice {
    router: {
        location: Location;
        action: Action;
    };
}

export interface LoadingSlice extends Slice {
    loading: {
        [key: string]: any;
    };
}

export interface NavigationSlice extends Slice {
    navigationPrevented: boolean;
}

export interface IdleSlice extends Slice {
    idle: {
        timeout: number;
        state: "active" | "idle";
    };
}

export interface SetStateSlice extends Slice {
    app: {
        [module: string]: any;
    };
}

export type State = RouterSlice & LoadingSlice & IdleSlice & SetStateSlice & NavigationSlice;

export const createRouterSlice: (history: History) => ImmerStateCreator<RouterSlice> = (history: History) => set => {
    history.listen((location, action) => {
        set(draft => {
            draft.router.action = action;
            draft.router.location = location;
        });
    });

    return {
        router: {
            location: history.location,
            action: history.action,
        },
    };
};

export const createNavigationSlice: ImmerStateCreator<NavigationSlice> = set => ({
    navigationPrevented: false,
});

export const createLoadingSlice: ImmerStateCreator<LoadingSlice> = set => ({
    loading: {},
});

export const createSetStateSlice: ImmerStateCreator<SetStateSlice> = set => ({
    app: {},
});

export const createIdleSlice: ImmerStateCreator<IdleSlice> = set => ({
    idle: {
        timeout: DEFAULT_IDLE_TIMEOUT,
        state: "active",
    },
});

export const createRootStore = (history: History) => {
    return create<State>()(
        immer(
            devtools((...a) => ({
                ...createRouterSlice(history)(...a),
                ...createLoadingSlice(...a),
                ...createIdleSlice(...a),
                ...createSetStateSlice(...a),
                ...createNavigationSlice(...a),
            }))
        )
    );
};

export const showLoading = (state: State, identifier: string = "global") => state.loading[identifier] > 0;
