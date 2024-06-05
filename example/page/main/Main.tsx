import "./index.css";
import React from "react";
import { Routes, Route, cloneRoute } from "../../../src";
import { Navigate } from "react-router";
import { RootState } from "../../type/state";
import { FTIRoutes } from "../../route";
import { FTIRoute } from "../../route/type";
import { State as MainState } from "./type";
import { app } from "../../../src/app";

interface Props extends Pick<MainState, "loading"> { }

const pathName = (route: FTIRoute, parentPath: string | undefined) => {
    if (route.path.startsWith("/")) {
        return route.path;
    } else if (parentPath) {
        if (route.path) {
            return parentPath + "/" + route.path;
        } else {
            return parentPath;
        }
    } else {
        return "/" + route.path;
    }
}

export default () => {
    const location = app.store.router(state => state.location)
    const pageName = location.pathname === "/Test" ? "Template" : "Test"

    const renderRoute = (route: FTIRoute, parentPath?: any): JSX.Element[] => {
        if (route?.hidden) return [];
        let routes = [];
        const path = pathName(route, parentPath);
        if (route.Component) {
            if (route.role) {
                const clone = cloneRoute(<Route key={path} path={path} Component={route.Component} />);
                routes.push(clone);
            } else {
                return [];
            }
        } else if (route.children && route.children.length > 0 && route.children[0].Component) {
            const clone = cloneRoute(<Route key={path} path={path} Component={route.children[0].Component} />);
            routes.push(clone);
        }
        if (route.children) {
            for (const child of route.children) {
                routes = routes.concat(renderRoute(child, path));
            }
        }
        return routes;
    }

    return (
        <div>
            <button onClick={() => app.navigate(`/${pageName}`)}>Go {pageName} Page</button>

            <Routes>
                {cloneRoute(<Route caseSensitive key="/" path="/" Component={() => <Navigate to="/Template" />} />)}
                {FTIRoutes.map(route => renderRoute(route))}
            </Routes>
        </div>
    )
}
