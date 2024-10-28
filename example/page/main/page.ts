import {Interval, Module, register} from "../../../src";
import type {RootState} from "../../type/state";
import {State} from "./type";

const initialState: State = {
    loading: false,
};

class MainModule extends Module<RootState, "main"> {
    setData<K extends keyof State>(state: Partial<Pick<State, K>>) {
        this.setState(state as Pick<State, K>);
    }
    // @Interval(1)
    // override async onTick() {
    //     console.log(this.name);
    // }
}

export const page = register(new MainModule("main", initialState));
