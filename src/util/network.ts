import axios, {AxiosError, type AxiosInterceptorManager, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig, type Method} from "axios";
import {APIException, NetworkConnectionException} from "../Exception";
import {parseWithDate} from "./json-util";
import {app} from "../app";
import {v4 as uuidv4} from "uuid";

const REQUEST_ID = "x-request-id";

export type PathParams<T extends string> = string extends T
    ? {[key: string]: string | number}
    : T extends `${infer Start}:${infer Param}/${infer Rest}`
      ? {[k in Param | keyof PathParams<Rest>]: string | number}
      : T extends `${infer Start}:${infer Param}`
        ? {[k in Param]: string | number}
        : {};

export interface APIErrorResponse {
    id?: string | null;
    errorCode?: string | null;
    message?: string | null;
    status_code?: string | null;
    error_code?: string | null;
    error_message?: string | null;
}

const ajaxClient = axios.create({
    transformResponse: (data, headers) => {
        if (data) {
            // API response may be void, in such case, JSON.parse will throw error
            const contentType = headers?.["content-type"];
            if (contentType?.startsWith("application/json")) {
                return parseWithDate(data);
            } else {
                throw new NetworkConnectionException("ajax() response not in JSON format", "");
            }
        } else {
            return data;
        }
    },
});

ajaxClient.interceptors.response.use(
    response => response,
    error => {
        if (axios.isAxiosError(error)) {
            const typedError = error as AxiosError<APIErrorResponse | undefined>;
            const requestURL = typedError.config?.url || "-";

            if (typedError.response) {
                const responseData = typedError.response.data;
                // Treat "cloud" error as Network Exception, e.g: gateway/load balancer issue
                const networkErrorStatusCodes: number[] = [0, 502, 504];
                if (responseData && !networkErrorStatusCodes.includes(typedError.response.status)) {
                    // Try to get server error message/ID/code from response
                    const errorId: string | null = responseData?.id || responseData.status_code || null;
                    const errorCode: string | null = responseData?.errorCode || responseData.error_code || null;
                    const errorMessage: string = responseData.message || responseData.error_message || `[No Response]`;
                    throw new APIException(errorMessage, typedError.response.status, requestURL, responseData, errorId, errorCode);
                }
            }

            throw new NetworkConnectionException(`Failed to connect: ${requestURL}`, requestURL, `${typedError.code || "UNKNOWN"}: ${typedError.message}`);
        } else if (error instanceof NetworkConnectionException) {
            throw error;
        } else {
            throw new NetworkConnectionException(`Unknown network error`, `[No URL]`, error.toString());
        }
    }
);

export async function uploadLog<Request, Response, Path extends string>(
    method: Method,
    path: Path,
    pathParams: PathParams<Path>,
    request: Request,
    extraConfig: Partial<AxiosRequestConfig> = {}
): Promise<Response> {
    const fullURL = urlParams(path, pathParams);
    const config: AxiosRequestConfig = {...extraConfig, method, url: fullURL};

    if (request) {
        if (method === "GET" || method === "DELETE") {
            config.params = request;
        } else if (method === "POST" || method === "PUT" || method === "PATCH") {
            config.data = request;
        }
    }

    config.headers = {
        ...extraConfig.headers,
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    const response = await ajaxClient.request<Response>(config);
    return response.data;
}

export async function ajax<Request, Response, Path extends string>(
    method: Method,
    path: Path,
    pathParams: PathParams<Path>,
    request: Request,
    extraConfig: Partial<AxiosRequestConfig> = {}
): Promise<Response> {
    const fullURL = urlParams(path, pathParams);
    const config: AxiosRequestConfig = {...extraConfig, method, url: fullURL};
    const requestId = uuidv4();
    const startTime = Date.now();
    const action = `api:${method}:${fullURL}`;

    if (request) {
        if (method === "GET" || method === "DELETE") {
            config.params = request;
        } else if (method === "POST" || method === "PUT" || method === "PATCH") {
            config.data = request;
        }
    }

    config.headers = {
        ...extraConfig.headers,
        "Content-Type": "application/json",
        Accept: "application/json",
        [REQUEST_ID]: requestId,
    };

    try {
        const response: AxiosResponse<any> = await ajaxClient.request<Response>(config);
        if (app.loggerConfig?.apiTracking) {
            const errorCode = response.data?.message || response.data?.error_code || "";
            const errorMessage = response.data?.errorCode || response.data?.error_message || "";
            app.logger.info({
                action,
                elapsedTime: Date.now() - startTime,
                info: {
                    errorCode,
                    errorMessage,
                    [REQUEST_ID]: response.config.headers[REQUEST_ID],
                },
            });
        }
        return response.data;
    } catch (error) {
        if (!app.loggerConfig?.apiTracking) throw error;
        if (error instanceof APIException) {
            app.logger.error({
                action,
                elapsedTime: Date.now() - startTime,
                errorCode: error.errorCode || "",
                errorMessage: error.message,
                info: {
                    [REQUEST_ID]: requestId,
                },
            });
        } else if (error instanceof NetworkConnectionException) {
            app.logger.error({
                action,
                elapsedTime: Date.now() - startTime,
                errorCode: error.originalErrorMessage,
                errorMessage: error.message,
                info: {[REQUEST_ID]: requestId},
            });
        } else {
            app.logger.error({
                action,
                elapsedTime: Date.now() - startTime,
                errorCode: "UNKNOWN_ERROR",
                errorMessage: JSON.stringify(error),
                info: {
                    [REQUEST_ID]: requestId,
                },
            });
        }
        throw error;
    }
}

export function uri<Request>(path: string, request: Request): string {
    const config: AxiosRequestConfig = {method: "GET", url: path, params: request};
    return ajaxClient.getUri(config);
}

export function urlParams(pattern: string, params: object): string {
    if (!params) {
        return pattern;
    }
    let url = pattern;
    Object.entries(params).forEach(([name, value]) => {
        const encodedValue = encodeURIComponent(value.toString());
        url = url.replace(":" + name, encodedValue);
    });
    return url;
}

export const setAjaxRequestInterceptor: AxiosInterceptorManager<InternalAxiosRequestConfig>["use"] = (onFulfilled, onRejected?, options?) => {
    return ajaxClient.interceptors.request.use(onFulfilled, onRejected, options);
};

export const setAjaxResponseInterceptor: AxiosInterceptorManager<AxiosResponse>["use"] = (onFulfilled?, onRejected?, options?) => {
    return ajaxClient.interceptors.response.use(onFulfilled, onRejected, options);
};
