import React from "react";
import {render, screen, act, waitFor} from "@testing-library/react";
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {IdleDetector, IdleDetectorContext, DEFAULT_IDLE_TIMEOUT} from "../../src/util/IdleDetector";
import {app, setIdleTimeout} from "../../src";

describe("IdleDetector", () => {
    setIdleTimeout(1);
    // beforeEach(() => {
    //     vi.useFakeTimers();
    // });

    // afterEach(() => {
    //     vi.clearAllTimers();
    //     vi.restoreAllMocks();
    // });

    it("should set idle state to 'idle' after timeout", async () => {
        render(
            <IdleDetector>
                <div data-testid="child">Child</div>
            </IdleDetector>
        );

        await waitFor(
            () => {
                expect(app.getState("idle").state).toBe("idle");
            },
            {timeout: 1100}
        );
    });

    it("should reset timer on user interaction", async () => {
        render(
            <IdleDetector>
                <div data-testid="child">Child</div>
            </IdleDetector>
        );

        act(async () => {
            await waitFor(
                () => {
                    window.dispatchEvent(new Event("click"));
                },
                {timeout: 500}
            );
        });

        await waitFor(
            () => {
                expect(app.getState("idle").state).toBe("active");
            },
            {timeout: 1100}
        );
    });
});
