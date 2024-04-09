import "./index.css";
import React from "react";
import {Route} from "../../../src";
import {RouteProps, Redirect} from "react-router";
import {Switch} from "react-router-dom";
import {RootState} from "../../type/state";
import {FTIRoutes} from "../../route";
import {FTIRoute} from "../../route/type";
import {State as MainState} from "./type";

interface Props extends Pick<MainState, "loading"> {}

class Main extends React.Component<Props & RouteProps> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    renderRoute(route: FTIRoute, parentPath?: string): JSX.Element[] {
        if (route?.hidden) return [];
        let routes = [];
        const path = this.pathName(route, parentPath);
        if (route.component) {
            if (route.role) {
                routes.push(<Route key={path} path={path} component={route.component} />);
            } else {
                return [];
            }
        } else if (route.children && route.children.length > 0 && route.children[0].component) {
            routes.push(<Route key={path} path={path} component={route.children[0].component} />);
        }
        if (route.children) {
            for (const child of route.children) {
                routes = routes.concat(this.renderRoute(child, path));
            }
        }
        return routes;
    }

    override render() {
        const {location} = this.props;

        return (
            <Switch key={location && location.pathname} location={location}>
                <Route exact key="/" path="/" component={() => <Redirect to="/Template" />} />

                {FTIRoutes.map(route => this.renderRoute(route))}
            </Switch>
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

const mapStatesToProps = (state: RootState): Props => {
    return {
        loading: false,
    };
};

export default Main;
