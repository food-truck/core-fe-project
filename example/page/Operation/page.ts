import { Loading, Module, register, delay } from "../../../src";
import { initialState } from "./state";
import { RootState } from "../../type/state";
import { actions as templateActions } from "../Template"

class OperationModule extends Module<RootState, "Operation"> {
    @Loading("add")
    async addItem() {
        templateActions.cancelGetTodoList();
        const { list } = this.rootState.app.Template;
        const { name } = this.state;
        await delay(1000)
        templateActions.setList([...list, name]);
    }
    changeName(newValue: string) {
        this.setState({
            name: newValue
        })
    }
}

export const page = register(new OperationModule("Operation", initialState));
