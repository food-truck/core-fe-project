import {describe, test, expect} from "vitest";
import {waitFor} from "@testing-library/dom";
import {Subscribe, Module, State, app, register} from "../../src";

describe("Subscribe decorator", () => {
    class Person extends Module<State, "person"> {
        increase() {
            this.setState({
                count: this.state.count + 1,
            });
        }
        uninstalled() {
            this.listenCountChange();
        }
        @Subscribe((state: any) => state?.person?.count)
        listenCountChange(value?: number, prev?: number) {
            this.setState({
                countClone: value,
                countClonePrev: prev,
            });
        }
    }
    const page = register(new Person("person", {count: 0, countClone: 0, countClonePrev: 0}));
    const actions = page.getActions();

    test("Subscribe app store data change.", async () => {
        actions.increase();

        await waitFor(() => {
            expect(app.getState("app").person.countClone).toBe(1);
            expect(app.getState("app").person.countClonePrev).toBe(0);
        });

        actions.increase();
        await waitFor(() => {
            expect(app.getState("app").person.countClone).toBe(2);
            expect(app.getState("app").person.countClonePrev).toBe(1);
        });
    });

    test("Subscribe can be uninstalled.", async () => {
        actions.listenCountChange();
        actions.increase();
        await waitFor(() => {
            expect(app.getState("app").person.countClone).toBe(2);
            expect(app.getState("app").person.countClonePrev).toBe(1);
        });
    });
});
