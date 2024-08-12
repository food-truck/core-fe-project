import {describe, it, vi, expect, afterEach} from "vitest";
import {isBrowserSupported, isIOS} from "../../src/util/navigator-util";

describe("isBrowserSupported", () => {
    const originalUserAgent = navigator.userAgent;
    const originalProxy = global.Proxy;
    const originalShadowRoot = global.ShadowRoot;

    afterEach(() => {
        Object.defineProperty(navigator, "userAgent", {
            value: originalUserAgent,
            writable: true,
        });
        global.Proxy = originalProxy;
        global.ShadowRoot = originalShadowRoot;
    });

    it("should return false for Internet Explorer", () => {
        Object.defineProperty(navigator, "userAgent", {
            value: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)",
            writable: true,
        });
        expect(isBrowserSupported()).toBe(false);
    });

    it("should return false if Proxy is not supported", () => {
        Object.defineProperty(navigator, "userAgent", {
            value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            writable: true,
        });
        global.Proxy = undefined as any;
        expect(isBrowserSupported()).toBe(false);
    });

    it("should return false if ShadowRoot is not supported", () => {
        Object.defineProperty(navigator, "userAgent", {
            value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            writable: true,
        });
        global.ShadowRoot = undefined as any;
        expect(isBrowserSupported()).toBe(false);
    });

    it("should return true for supported browsers", () => {
        Object.defineProperty(navigator, "userAgent", {
            value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            writable: true,
        });
        expect(isBrowserSupported()).toBe(true);
    });
});

describe("isIOS", () => {
    const originalUserAgent = navigator.userAgent;

    afterEach(() => {
        Object.defineProperty(navigator, "userAgent", {
            value: originalUserAgent,
            writable: true,
        });
    });

    it("should return true for iPhone", () => {
        Object.defineProperty(navigator, "userAgent", {
            value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
            writable: true,
        });
        expect(isIOS()).toBe(true);
    });

    it("should return true for iPad", () => {
        Object.defineProperty(navigator, "userAgent", {
            value: "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)",
            writable: true,
        });
        expect(isIOS()).toBe(true);
    });

    it("should return true for iPod", () => {
        Object.defineProperty(navigator, "userAgent", {
            value: "Mozilla/5.0 (iPod; CPU iPhone OS 14_0 like Mac OS X)",
            writable: true,
        });
        expect(isIOS()).toBe(true);
    });

    it("should return false for non-iOS devices", () => {
        Object.defineProperty(navigator, "userAgent", {
            value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            writable: true,
        });
        expect(isIOS()).toBe(false);
    });
});
