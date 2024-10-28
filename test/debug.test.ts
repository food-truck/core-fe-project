import {describe, it, beforeEach, vi, expect, afterEach} from "vitest";
import {app} from "../src";
import {debugFn} from "../src/debug";

declare const global: any;

describe("window.__GET_LOGS__ and window.__PRINT_LOGS__", () => {
    beforeEach(() => {
        global.window = {};
        process.env.NODE_ENV = "development";
        debugFn();
        vi.spyOn(console, "info").mockImplementation(() => {});
    });

    it("should define window.__GET_LOGS__ and window.__PRINT_LOGS__ in development", () => {
        expect(typeof global.window.__GET_LOGS__).toBe("function");
        expect(typeof global.window.__PRINT_LOGS__).toBe("function");
    });

    it("window.__GET_LOGS__ should call app.logger.collect", () => {
        const collectMock = vi.spyOn(app.logger, "collect").mockReturnValue([]);

        global.window.__GET_LOGS__();

        expect(collectMock).toHaveBeenCalled();
    });

    it("window.__PRINT_LOGS__ should print logs correctly", () => {
        const logs = [
            {
                result: "OK",
                action: "TestAction",
                elapsedTime: 100,
                date: new Date(),
                errorCode: null,
                errorMessage: null,
                info: {},
                stats: {},
            },
            {
                result: "ERROR",
                action: "TestAction2",
                elapsedTime: 200,
                date: new Date(),
                errorCode: "500",
                errorMessage: "Internal Server Error",
                info: {detail: "error detail"},
                stats: {stat: "stat detail"},
            },
        ];

        vi.spyOn(app.logger, "collect").mockReturnValue(logs as any);

        global.window.__PRINT_LOGS__();

        expect(console.info).toHaveBeenCalled();
        expect(console.info).toHaveBeenCalledWith(`%c1. TestAction (100 ms)`, "background:green; color:#fff", logs[0].date.toLocaleString());
        expect(console.info).toHaveBeenCalledWith(`%c2. TestAction2 (200 ms)`, "background:red; color:#fff", logs[1].date.toLocaleString());
        expect(console.info).toHaveBeenCalledWith(`%c 500: Internal Server Error `, "background:red; color:#fff");
        expect(console.info).toHaveBeenCalledWith(`%c INFO `, "background:#ddd; color:#111", logs[1].info);
        expect(console.info).toHaveBeenCalledWith(`%c STATS `, "background:#ddd; color:#111", logs[1].stats);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        delete global.window;
    });
});
