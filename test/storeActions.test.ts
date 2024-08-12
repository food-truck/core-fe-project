import {app, setRouterState, setIdleTimeout, setIdleState} from "../src";
import {describe, expect, it, vi} from "vitest";
import {IdleState, RouterState, broswerHistory} from "../src/sliceStores";

describe("setRouterState", () => {
    it("setRouterState: should set router state correctly", () => {
        const payload: RouterState = {
            action: "PUSH",
            location: broswerHistory.location,
        };

        setRouterState(payload);

        expect(app.store.router.getState()).toEqual(payload);
    });
});

describe("setIdleTimeout", () => {
    it("should set idle timeout correctly", () => {
        const timeout = 3000;

        setIdleTimeout(timeout);

        expect(app.store.idle.getState().timeout).toBe(timeout);
    });
});

describe("setIdleState", () => {
    it("should set idle state correctly", () => {
        const state: IdleState["state"] = "active";

        setIdleState(state);

        expect(app.store.idle.getState().state).toBe(state);
    });
});
