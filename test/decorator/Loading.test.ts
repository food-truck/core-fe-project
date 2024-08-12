import {describe, test, expect} from "vitest";
import {waitFor} from "@testing-library/dom";
import {Loading, Module, State, app, delay, register} from "../../src";

describe("Loading decorator", () => {
    class Person extends Module<State, "person"> {
        @Loading()
        async fetchA() {
            await delay(1000);
        }
        @Loading("b")
        async fetchB() {
            await delay(1000);
        }
        @Loading("c", true)
        async fetchC() {
            await delay(1000);
        }
    }
    const page = register(new Person("person", {}));
    const actions = page.getActions();

    test("Should set global loading to true when running async.", async () => {
        actions.fetchA();
        expect(app.store.loading.getState().global > 0).toBe(true);

        await waitFor(
            () => {
                expect(app.store.loading.getState().global > 0).toBe(false);
            },
            {timeout: 1100}
        );
    });

    test("Should set loading B to true when running async.", async () => {
        actions.fetchB();
        expect(app.store.loading.getState().b > 0).toBe(true);

        await waitFor(
            () => {
                expect(app.store.loading.getState().b > 0).toBe(false);
            },
            {timeout: 1100}
        );
    });

    test("Should set initial loading to true when before execute the action.", async () => {
        expect(app.store.loading.getState().c > 0).toBe(true);
        actions.fetchC();
        expect(app.store.loading.getState().c > 0).toBe(true);

        await waitFor(
            () => {
                expect(app.store.loading.getState().c > 0).toBe(false);
            },
            {timeout: 1100}
        );
    });
});
