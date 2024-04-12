import { Loading, Module, register } from "../../../src";
import { initialState } from "./state";
import { RootState } from "../../type/state";

export class MockData {
    static todoList(signal?: AbortSignal): Promise<string[]> {
        let isPromiseEnd = false
        return new Promise((resolve, reject) => {
            const abortHanlder = () => {
                if (!isPromiseEnd) {
                    reject("cancelled");
                    isPromiseEnd = true;
                }
            }

            if (signal) {
                signal?.addEventListener("abort", abortHanlder)
            }
            setTimeout(() => {
                if (!isPromiseEnd) {
                    resolve(["apple", "🍊", "🌰"]);
                    isPromiseEnd = true
                }
                signal?.removeEventListener("abort", abortHanlder)
            }, 1500);
        });
    }
}

class TemplateModule extends Module<RootState, "Template"> {
    override async onEnter(entryComponentProps: any) {
        await this.getTodoList();
    }

    cancelGetTodoList() {
        this.abortControllerMap["getTodoList"]?.abort()
    }

    setList(list: string[]) {
        this.setState({ list })
    }

    @Loading("abc")
    async getTodoList() {
        const list = await this.executeAsync(MockData.todoList, "getTodoList")
        this.setList(list)
    }
}

export const page = register(new TemplateModule("Template", initialState));
