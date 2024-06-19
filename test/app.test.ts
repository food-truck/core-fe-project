import {describe, expect, test} from "vitest";
import {app} from "../src";

describe("App.store test", () => {
    const STORE_KEYS = ["app", "router", "loading", "idle"];

    test("All store available", async () => {
        const stores = Object.entries(app.store);

        expect(
            STORE_KEYS.every(key => {
                const store = app.store[key];
                if (!store.getState) return false;
                if (!store.setState) return false;
                if (!store.subscribe) return false;
                return true;
            })
        ).toBeTruthy();
    });
});
