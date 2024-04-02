import "core-js/stable";
import "regenerator-runtime/runtime";
import "./debug";

export * as immer from "immer";
export {bootstrap, useStore} from "./platform/bootstrap";
export {Module} from "./platform/Module";
export type {ModuleLocation, ModuleLifecycleListener} from "./platform/Module.tsx";
export {async, type AsyncOptions, type AsyncErrorComponentProps} from "./util/async";
export {captureError} from "./util/error-util";
export {ajax, uri, setAjaxRequestInterceptor, setAjaxResponseInterceptor} from "./util/network";
export {ErrorBoundary} from "./util/ErrorBoundary";
export {IdleDetector, IdleDetectorContext} from "./util/IdleDetector";
export {Route} from "./util/Route";

export {useAction, useObjectKeyAction, useUnaryAction, useBinaryAction, usePromise} from "./hooks/action";
export {useLoadingStatus} from "./hooks/loading";

export {Interval} from "./decorator/Interval";
export {Loading} from "./decorator/Loading";
export {Log} from "./decorator/Log";
export {Mutex} from "./decorator/Mutex";
export {RetryOnNetworkConnectionError} from "./decorator/RetryOnNetworkConnectionError";
export {SilentOnNetworkConnectionError} from "./decorator/SilentOnNetworkConnectionError";

export {Exception, APIException, NetworkConnectionException} from "./Exception";
export * from "./storeActions";
export {register, type ErrorListener} from "./module";
export {logger} from "./app";

export {Switch, Redirect, NavLink, useLocation, useHistory, useParams, useRouteMatch, matchPath} from "react-router-dom";
export type {Location} from "history";
export {produce} from "immer";
