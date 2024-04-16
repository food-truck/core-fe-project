import { Loading, Module, register, delay, Subscribe } from "../../../src";
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
    override onDestroy(): void {
        this.listenList();
    }
    @Subscribe(state => state.app.Template?.list)
    private listenList(value?: RootState["app"]["Template"]["list"], prevValue?: RootState["app"]["Template"]["list"]) {
        console.info(`new List ${value} & old List ${prevValue}`)
    }
}

export const page = register(new OperationModule("Operation", initialState));
