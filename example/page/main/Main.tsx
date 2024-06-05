import "./index.css";
import React from "react";
import {Routes, Route, cloneRoute} from "../../../src";
import {Navigate} from "react-router";
import {RootState} from "../../type/state";
import {FTIRoutes} from "../../route";
import {FTIRoute} from "../../route/type";
import {State as MainState} from "./type";
import {app} from "../../../src/app";

interface Props extends Pick<MainState, "loading"> {}

class Main extends React.Component<Props & any> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    renderRoute(route: FTIRoute, parentPath?: string): JSX.Element[] {
        if (route?.hidden) return [];
        let routes = [];
        const path = this.pathName(route, parentPath);
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
                routes = routes.concat(this.renderRoute(child, path));
            }
        }
        return routes;
    }

    override render() {
        return (
            <div>
                <button onClick={() => app.store.router.getState().navigate?.("/Test")}>Go Test Page</button>

                <Routes>
                    {cloneRoute(<Route caseSensitive key="/" path="/" Component={() => <Navigate to="/Template" />} />)}

                    {FTIRoutes.map(route => this.renderRoute(route))}
                </Routes>
            </div>
        );
    }

    private pathName(route: FTIRoute, parentPath: string | undefined) {
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
}

export default Main;
