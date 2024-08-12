import {describe, test, expect} from "vitest";
import {waitFor} from "@testing-library/dom";
import {Subscribe, Module, State, app, delay, register} from "../../src";

class MockData {
    static todoList(signal?: AbortSignal): Promise<number> {
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
                    resolve(1);
                    isPromiseEnd = true;
                }
                signal?.removeEventListener("abort", abortHanlder);
            }, 500);
        });
    }
}

describe("Module", () => {
    const FETCH_KEY = "fetchResponse";

    class Person extends Module<State, "module"> {
        async fetchResponse() {
            const res = await this.executeAsync(MockData.todoList, FETCH_KEY);
            this.setState({count: res});
        }
        cancelFetch() {
            this.abortControllerMap?.[FETCH_KEY].abort?.();
        }
    }
    const page = register(new Person("module", {count: 0}));
    const actions = page.getActions();

    test("Async action can be cancelled.", async () => {
        actions.fetchResponse();
        actions.cancelFetch();
        await waitFor(
            () => {
                expect(app.getState("app").module.count).toBe(0);
            },
            {timeout: 600}
        );

        actions.fetchResponse();
        await waitFor(
            () => {
                expect(app.getState("app").module.count).toBe(1);
            },
            {timeout: 600}
        );
    });
});
