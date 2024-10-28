import React from "react";
import {createRoot} from "react-dom/client";
import axios from "axios";
import {app} from "../app";
import {type ErrorListener, executeAction} from "../module";
import {ErrorBoundary} from "../util/ErrorBoundary";
import {ajax} from "../util/network";
import {isBrowserSupported, isIOS} from "../util/navigator-util";
import {captureError} from "../util/error-util";
import {DEFAULT_IDLE_TIMEOUT, IdleDetector} from "../util/IdleDetector";
import {setIdleTimeout} from "../storeActions";
import {Provider, createZustandContext} from "../ZustandProvider";
import {errorToException, type LoggerConfig, delay, APIException} from "@wonder/core-core";

/**
 * Configuration for frontend version check.
 * If the `versionCheckURL` API response changes, `onRemind` will be executed.
 */
interface VersionCheckConfig {
    onRemind: () => void;
    versionCheckURL: string; // Must be GET Method, returning whatever JSON
    frequencyInSecond?: number; // Default: 600 (10 min)
}

/**
 * Configuration for browser related features.
 * - onOldBrowserDetected: Alert to user or redirect when using unsupported legacy browser.
 * - onLocationChange: A global event handler for any location change events.
 * - navigationPreventionMessage: Only useful if you are leaving some page, whose "setNavigationPrevented" is toggled as true.
 */
interface BrowserConfig {
    onOldBrowserDetected?: () => void;
    onLocationChange?: (location: Location) => void;
}

interface BootstrapOption {
    componentType: React.ComponentType;
    errorListener: ErrorListener;
    rootContainer?: HTMLElement;
    browserConfig?: BrowserConfig;
    loggerConfig?: LoggerConfig;
    versionConfig?: VersionCheckConfig;
    idleTimeoutInSecond?: number; // Default: 5 min, never Idle if non-positive value given
}

export const LOGGER_ACTION = "@@framework/logger";
export const VERSION_CHECK_ACTION = "@@framework/version-check";
export const GLOBAL_ERROR_ACTION = "@@framework/global";
export const GLOBAL_PROMISE_REJECTION_ACTION = "@@framework/promise-rejection";

export function bootstrap(option: BootstrapOption): void {
    detectOldBrowser(option.browserConfig?.onOldBrowserDetected);
    setupGlobalErrorHandler(option.errorListener);
    setupAppExitListener(option.loggerConfig?.serverURL);
    setIdleTimeout(option.idleTimeoutInSecond ?? DEFAULT_IDLE_TIMEOUT);
    runBackgroundLoop(option.loggerConfig, option.versionConfig);
    createZustandContext();
    renderRoot(option.componentType, option.rootContainer || injectRootContainer());
}

function detectOldBrowser(onOldBrowserDetected?: () => void) {
    if (!isBrowserSupported()) {
        if (onOldBrowserDetected) {
            onOldBrowserDetected();
        } else {
            let alertMessage: string;
            const navigatorLanguage = navigator.languages ? navigator.languages[0] : navigator.language;
            if (navigatorLanguage.startsWith("zh")) {
                alertMessage = "对不起，您的浏览器版本太老不支持\n请使用最新版的浏览器再访问";
            } else {
                alertMessage = "Your browser is not supported.\nPlease upgrade your browser to latest and visit again.\nSorry for the inconvenience.";
            }
            alert(alertMessage);
        }
    }
}

function setupGlobalErrorHandler(errorListener: ErrorListener) {
    app.errorHandler = errorListener.onError.bind(errorListener);
    window.addEventListener(
        "error",
        event => {
            try {
                const analyzeByTarget = (): string => {
                    if (event.target && event.target !== window) {
                        const element = event.target as HTMLElement;
                        return `DOM source error: ${element.outerHTML}`;
                    }
                    return `Unrecognized error, serialized as ${JSON.stringify(event)}`;
                };
                captureError(event.error || event.message || analyzeByTarget(), GLOBAL_ERROR_ACTION);
            } catch (e) {
                /**
                 * This should not happen normally.
                 * However, global error handler might catch external webpage errors, and fail to parse error due to cross-origin limitations.
                 * A typical example is: Permission denied to access property `foo`
                 */
                app.logger.warn({
                    action: GLOBAL_ERROR_ACTION,
                    errorCode: "ERROR_HANDLER_FAILURE",
                    errorMessage: errorToException(e).message,
                    elapsedTime: 0,
                    info: {},
                });
            }
        },
        true
    );
    window.addEventListener(
        "unhandledrejection",
        event => {
            try {
                captureError(event.reason, GLOBAL_PROMISE_REJECTION_ACTION);
            } catch (e) {
                app.logger.warn({
                    action: GLOBAL_PROMISE_REJECTION_ACTION,
                    errorCode: "ERROR_HANDLER_FAILURE",
                    errorMessage: errorToException(e).message,
                    elapsedTime: 0,
                    info: {},
                });
            }
        },
        true
    );
}

function renderRoot(EntryComponent: React.ComponentType, rootContainer: HTMLElement) {
    const root = createRoot(rootContainer);

    root.render(
        <Provider store={app.store}>
            <IdleDetector>
                <ErrorBoundary>
                    <EntryComponent />
                </ErrorBoundary>
            </IdleDetector>
        </Provider>
    );
}

function injectRootContainer(): HTMLElement {
    const rootContainer = document.createElement("div");
    rootContainer.id = "framework-app-root";
    document.body.appendChild(rootContainer);
    return rootContainer;
}

function setupAppExitListener(eventServerURL?: string) {
    if (eventServerURL) {
        // ref: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW5
        window.addEventListener(
            isIOS() ? "pagehide" : "unload",
            () => {
                try {
                    app.logger.info({action: "@@EXIT"});
                    const logs = app.logger.collect();
                    /**
                     * navigator.sendBeacon() uses HTTP POST, but does not support CORS.
                     * We have to use text/plain as content type, instead of JSON.
                     */
                    const textData = JSON.stringify({events: logs});
                    navigator.sendBeacon(eventServerURL, textData);
                } catch (e) {
                    // Silent if sending error
                }
            },
            false
        );
    }
}

function runBackgroundLoop(loggerConfig?: LoggerConfig, versionCheckConfig?: VersionCheckConfig) {
    app.logger.info({action: "@@ENTER"});
    app.loggerConfig = loggerConfig || null;

    if (loggerConfig) {
        runSendEventLogs();
    }

    if (versionCheckConfig) {
        runVersionCheck(versionCheckConfig);
    }

    function runSendEventLogs() {
        async function loop() {
            await sendEventLogs();
            await delay((loggerConfig?.frequencyInSecond || 20) * 1000);
            requestAnimationFrame(loop);
        }
        loop();
    }

    function runVersionCheck(versionCheckConfig: VersionCheckConfig) {
        let lastChecksum: string | null = null;
        async function checkLoop() {
            const newChecksum = await fetchVersionChecksum(versionCheckConfig.versionCheckURL);
            if (newChecksum) {
                if (lastChecksum !== null && newChecksum !== lastChecksum) {
                    await executeAction({
                        actionName: VERSION_CHECK_ACTION,
                        handler: versionCheckConfig.onRemind,
                        payload: [],
                    });
                    lastChecksum = newChecksum;
                }
            }
            await delay((versionCheckConfig.frequencyInSecond || 600) * 1000);
            requestAnimationFrame(checkLoop);
        }
        checkLoop();
    }
}

export async function sendEventLogs(): Promise<void> {
    if (app.loggerConfig) {
        const logs = app.logger.collect(200);
        const logLength = logs.length;
        if (logLength > 0) {
            try {
                /**
                 * Event server URL may be different from current domain (supposing abc.com)
                 *
                 * In order to support this, we must ensure:
                 * - Event server allows cross-origin request from current domain
                 * - Root-domain cookies, whose domain is set by current domain as ".abc.com", can be sent (withCredentials = true)
                 */
                await ajax("POST", app.loggerConfig.serverURL, {}, {events: logs}, {withCredentials: true});
                app.logger.emptyLastCollection();
            } catch (e) {
                if (e instanceof APIException) {
                    // For APIException, retry always leads to same error, so have to give up
                    // Do not log network exceptions
                    app.logger.emptyLastCollection();
                    app.logger.exception(e, {dropped_logs: logLength.toString()}, LOGGER_ACTION);
                }
            }
        }
    }
}

/**
 * Only call this function if necessary, i.e: initial checksum, or after long-staying check
 * Return latest checksum, or null for failure.
 */
async function fetchVersionChecksum(url: string): Promise<string | null> {
    const startTime = Date.now();
    try {
        const response = await axios.get(url);
        const checksum = JSON.stringify(response.data);
        app.logger.info({
            action: VERSION_CHECK_ACTION,
            elapsedTime: Date.now() - startTime,
            info: {checksum},
        });
        return checksum;
    } catch (e) {
        app.logger.warn({
            action: VERSION_CHECK_ACTION,
            elapsedTime: Date.now() - startTime,
            errorCode: "VERSION_CHECK_FAILURE",
            errorMessage: errorToException(e).message,
        });
        return null;
    }
}
