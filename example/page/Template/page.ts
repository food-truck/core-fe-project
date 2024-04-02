import { Module, register } from "../../../src";
import { initialState } from "./state";
import { RootState } from "../../type/state";

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
    override onEnter(entryComponentProps: any) {
        this.getTodoList();
    }

    async getTodoList() {
        const list = await MockData.todoList();
        this.setState({ list });
    }
}

export const page = register(new TemplateModule("Template", initialState));
