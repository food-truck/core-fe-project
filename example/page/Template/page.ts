import {call, Module, register, Loading, SagaGenerator, Interval, createActionHandlerDecorator} from "../../../src";
import {initialState} from "./state";
import {LOADING} from "./type";
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
    override *onEnter(entryComponentProps: any): SagaGenerator {
        yield* this.getTodoList();
    }

    @Loading(LOADING)
    *getTodoList(): SagaGenerator {
        const list = yield* call(MockData.todoList);
        this.setState({list});
    }
}

export const page = register(new TemplateModule("Template", initialState));
