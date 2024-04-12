import { Loading, Module, register } from "../../../src";
import { initialState } from "./state";
import { RootState } from "../../type/state";

class MockData {
    static todoList(signal?: AbortSignal): Promise<string[]> {
        let isPromiseEnd = false
        return new Promise(resolve => {
            const abortHanlder = () => {
                if (!isPromiseEnd) {
                    resolve(["cancelled"]);
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
        const res = await this.getTodoList();
    }

    cancelGetTodoList() {
       this.abortSignalMap["getTodoList"]?.abort()
    }

    @Loading("abc")
    async getTodoList() {
        const list = await this.executeAsync(MockData.todoList, "getTodoList")
        this.setState({ list });
        return list;
    }
}

export const page = register(new TemplateModule("Template", initialState));
