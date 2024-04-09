import React, {useEffect} from "react";
import {Navigate, Route as ReactRouterDOMRoute} from "react-router-dom";
import type {PathRouteProps, LayoutRouteProps, IndexRouteProps} from "react-router";
import {ErrorBoundary} from "./ErrorBoundary";
import {app} from "../app";

interface Props {
    // All below are optional
    withErrorBoundary: boolean;
    accessCondition: boolean;
    unauthorizedRedirectTo: string;
    notFound: boolean;
}

const CommonElement: React.FC<Props & {element: React.ReactNode}> = props => {
    const {element, accessCondition, unauthorizedRedirectTo, notFound, withErrorBoundary} = props;
    if (accessCondition) {
        const node = notFound ? withNotFoundWarning(element) : element;
        return withErrorBoundary ? <ErrorBoundary>{node}</ErrorBoundary> : node;
    } else {
        return <Navigate to={unauthorizedRedirectTo} replace />;
    }
};

export function Route(props: Partial<Props> & PathRouteProps): React.ReactElement;
export function Route(props: Partial<Props> & LayoutRouteProps): React.ReactElement;
export function Route(props: Partial<Props> & IndexRouteProps): React.ReactElement;
export function Route(props: Partial<Props> & (PathRouteProps | LayoutRouteProps | IndexRouteProps)): React.ReactElement {
    const {element, accessCondition = true, unauthorizedRedirectTo = "/", notFound = false, withErrorBoundary = true, caseSensitive = true, ...reset} = props;
    const commonProps = {
        element,
        accessCondition,
        unauthorizedRedirectTo,
        notFound,
        withErrorBoundary,
    };
    return <ReactRouterDOMRoute {...reset} caseSensitive={caseSensitive} element={<CommonElement {...commonProps} />} />;
}

function withNotFoundWarning(children: React.ReactNode): React.ReactElement {
    useEffect(() => {
        app.logger.warn({
            action: "@@framework/route-404",
            elapsedTime: 0,
            errorMessage: `${location.href} not supported by <Route>`,
            errorCode: "ROUTE_NOT_FOUND",
            info: {},
        });
    }, []);
    return <>{children}</>;
}
