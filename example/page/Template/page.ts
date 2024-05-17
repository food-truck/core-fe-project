import {Interval, Loading, Module, ModuleLocation, register} from "../../../src";
import {initialState} from "./state";
import {RootState} from "../../type/state";

export class MockData {
    static todoList(signal?: AbortSignal): Promise<string[]> {
        let isPromiseEnd = false;
        return new Promise((resolve, reject) => {
            const abortHanlder = () => {
                if (!isPromiseEnd) {
                    reject("cancelled");
                    isPromiseEnd = true;
                }
            };

            if (signal) {
                signal?.addEventListener("abort", abortHanlder);
            }
            setTimeout(() => {
                if (!isPromiseEnd) {
                    resolve(["apple", "🍊", "🌰"]);
                    isPromiseEnd = true;
                }
                signal?.removeEventListener("abort", abortHanlder);
            }, 1500);
        });
    }
}

class TemplateModule extends Module<RootState, "Template"> {
    override async onLocationMatched(routeParam: object, location: ModuleLocation<object>) {
        // console.info("routeParam", routeParam, location);
        const list = await MockData.todoList();
    }

    override async onEnter(entryComponentProps: any) {
        await this.getTodoList();
    }

    cancelGetTodoList() {
        this.abortControllerMap["getTodoList"]?.abort();
    }

    setList(list: string[]) {
        this.setState({list});
    }

    @Interval(1)
    override async onTick() {
        this.setState(pre => {
            pre.time = pre.time + 1;
        });
    }

    @Loading("abc")
    async getTodoList() {
        const list = await this.executeAsync(MockData.todoList, "getTodoList");
        this.setList(list);
    }
}

export const page = register(new TemplateModule("Template", initialState));
