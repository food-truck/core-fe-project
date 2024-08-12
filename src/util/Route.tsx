import React from "react";
import {createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate, type RouteProps, useLocation, useMatch, useNavigate, useNavigationType} from "react-router-dom";
import {ErrorBoundary} from "./ErrorBoundary";
import {app} from "../app";
import {setRouterState} from "../storeActions";

export const Routes = ({children}: {children: React.ReactNode}) => {
    const router = createBrowserRouter(createRoutesFromElements(children));

    app.navigate = router.navigate;

    router.subscribe(state => {
        setRouterState({
            action: state.historyAction,
            location: state.location,
        });
    });

    return <RouterProvider router={router} />;
};

interface Config {
    accessCondition?: boolean;
    unauthorizedRedirectTo?: string;
    notFound?: boolean;
}
function withHOC(WrappedComponent: React.ComponentType, {path, accessCondition, unauthorizedRedirectTo, notFound}: Required<Config> & {path: string}) {
    return function NewComponent(props: any) {
        const navigate = useNavigate();
        const action = useNavigationType();
        const location = useLocation();
        const match = useMatch(path);
        if (accessCondition) {
            return notFound ? withNotFoundWarning(WrappedComponent) : <WrappedComponent {...props} location={location} match={match} navigate={navigate} action={action} />;
        } else {
            return <Navigate to={unauthorizedRedirectTo} />;
        }
    };
}
export const cloneRoute = (element: JSX.Element, config?: Config) => {
    const {ErrorBoundary: ErrorComp, Component, path} = element.props as RouteProps;
    const props: RouteProps = {
        ...element.props,
        Component: withHOC(Component!, {
            path: path!,
            accessCondition: true,
            unauthorizedRedirectTo: "/",
            notFound: false,
            ...config,
        }),
        ErrorBoundary: ErrorComp
            ? props => (
                  <ErrorBoundary>
                      <ErrorComp {...props} />
                  </ErrorBoundary>
              )
            : ErrorComp,
    };

    return React.cloneElement(element, props);
};

function withNotFoundWarning<T extends {}>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T> {
    return class extends React.PureComponent<T> {
        override componentDidMount() {
            app.logger.warn({
                action: "@@framework/route-404",
                elapsedTime: 0,
                errorMessage: `${location.href} not supported by <Route>`,
                errorCode: "ROUTE_NOT_FOUND",
                info: {},
            });
        }

        override render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}
