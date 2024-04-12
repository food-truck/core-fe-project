import {Loading, Module, register} from "../../../src";
import {initialState} from "./state";
import {RootState} from "../../type/state";

class MockData {
    static todoList(): Promise<string[]> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(["apple", "🍊", "🌰"]);
            }, 1500);
        });
    }
}

class TemplateModule extends Module<RootState, "Template"> {
    override async onEnter(entryComponentProps: any) {
        const res = await this.getTodoList();
    }

    @Loading("abc")
    async getTodoList() {
        const list = await MockData.todoList();
        this.setState({list});
        return list;
    }
}

export const page = register(new TemplateModule("Template", initialState));
