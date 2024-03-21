import {Module, register, SagaGenerator, Interval} from "../../../src";
import type {RootState} from "../../type/state";
import {State} from "./type";

const initialState: State = {
    loading: false,
};

class MainModule extends Module<RootState, "main"> {
    *setData<K extends keyof State>(state: Partial<Pick<State, K>>): SagaGenerator {
        this.setState(state as Pick<State, K>);
    }

    // @Interval(10)
    // override *onTick(): SagaGenerator {}
}

export const page = register(new MainModule("main", initialState));
