## Overview

~~core-fe is a frontend framework based on react, redux, react-saga, it's designed to support our own projects.~~

core-fev2 is a frontend framework based on react, zustand, it's designed to support our own projects.

## Documentation

For detailed documentation on the core libraries used in this framework, please refer to the following links:

- [React](https://reactjs.org/docs/getting-started.html)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [@wonder/core-core](https://github.com/food-truck/core-core-project)

## Local Dev

This project uses [pnpm](https://pnpm.io/) to manage the dependencies.

- To install the dependencies, run `pnpm install`
- To run the build script, run `pnpm build`
- To publish to npm, run `pnpm publish`, which runs `pnpm build` automatically before publish

## Basic Features

The whole website is split into **modules**, usually by routes.

For each module, it contains **1 state** and **some actions**, to handle business logic.

To extend module features, modules can also implement its own lifecycle actions, like onEnter/onDestroy/onActive etc.

## Advanced Features

- global error-handler

- event collector

- action decorator

## Core API

- bootstrap

Bootstrap function, configuring entry component / error handler / log / initialization action.

- register

Register a module (including lifecycle actions and custom actions).

For more detailed instructions, please go to the `examples` folder.

## Migrating to v2
In v2, we made some changes, removing redux, redux-saga, generate syntax, etc. and replacing them with new libraries such as zustand. In this release, we also upgraded react-router from v5 to v6 The changes to this section are at the bottom of the document.

- Changed

In the Module, since we ditched redux-saga, we can use normal async, await syntax to handle business scenarios. Of course, removing saga would make it impossible for us to support some of its conveniences, such as automatically canceling an executing action when a route switch/module destroy occurs. For this reason, we provide the Module.executeAsync method to handle this scenario, see add/executeAsync for details.

##### before

```
class MainModule extends Module<RootState, "main"> {
    *fetchList(): SagaGenerator {
        const response = yield* call(ListService.list);
        this.setState({
            list: response.list
        })
    }
    *onEnter() {
        yield* this.fetchList();
    }
}
```

##### after

```
class MainModule extends Module<RootState, "main"> {
    async fetchList() {
        const response = await ListService.list();
        this.setState({
            list: response.list
        })
    }
    onEnter() {
        this.fetchList();
    }
}
```

And when using an action, you can call the function on the action directly without using a hook or dispatch.

##### before

```
import {actions} from "..";
import {useAction} from "@wonder/core-fe"

function Example() {
    const fetchList = useAction(actions.fetchList);

    return (
        <button onClick={fetchList}>Fetch List</button>
    );
}
```

##### after

```
import {actions} from "..";

function Example() {
    return (
        <button onClick={actions.fetchList}>Fetch List</button>
    );
}
```

~~app.history~~ -> app.navigate

#### before

```
app.history.push("/")
```

#### after

```
// Note: Because it is initially an empty method, it cannot be deconstructed.  
// Error: const {navigate} = app
app.navigate("/")
```

app.store: ~~app.store~~ -> app.store  Although it looks the same, the internal data has been replaced with zustand store.

#### before

```
app.store.dispatch()
app.store.getState().app.xxx
```

#### after

~~app.store.dispatch()~~  There is no longer a need to trigger an action.

[Use zustand store outside](https://github.com/pmndrs/zustand/issues/302)
```
// Under the store object are assigned the individual zustand stores
app.store.app.getState().xxx  
```

React-Router: We've also upgraded the routing section from React-router version 5x to version 6x.

- Added

#### Module.executeAsync

For these reasons, core-fe provides built-in asynchronous handlers for on-demand calls (built-in `executeAsync` function in module)
After wrapping asynchronous with this method, the abortcontroller will be mounted on `app.actionControllers`, and you can get the controller by `app.actionControllers[moduleName][key]` and decide whether to cancel the current action or not.
In the module, also added `abortControllerMap` attribute, you can directly get the current module under the mount of all controllermap.
In lifecycle `onDestroy`, asynchronous (unfinished) processing with executeAsync is uniformly canceled under the current module.
`executeAsync` If the `key` is duplicated in the same module, the new controller will replace the old one.

```
// async executeAsync<T extends any>(asyncFn: (signal: AbortSignal) => Promise<T>, key?: string)
// If the second parameter `key` is not passed, a uid will be generated by default.

class TemplateModule extends Module<RootState, "Template"> {
    override async onEnter(entryComponentProps: any) {
        await this.getTodoList();
    }
    cancelGetTodoList() {
        this.abortControllerMap["getTodoList"]?.abort()
    }
    async getTodoList() {
        const list = await this.executeAsync((signal: AbortSignal) => MockData.todoList(signal), "getTodoList")
        this.setList({list})
    }
}
```

#### app.actionControllers

We can retrieve the signals that were processed by the executeAsync method and have not been executed from this object by using the key and moduleName, and use them to cancel anywhere.
```
app.actionControllers["main"]["loadList"]?.abort()
```

#### app.getState

Similar to the old app: app.store.getState()
```
app.getState("app").main.list
app.getState("loading").global
```

#### Subscribe

This is a new decorator that listens for data changes in the appStore at the module level.

```
class TestModule extends Module<RootState, "Test"> {
    // The null case needs to be handled here, the decorator listener will execute before the state
    @Subscribe((state: RootState["app"]) => state?.Test?.list)
    private listenList(value?: RootState["app"]["Test"]["list"], prevValue?: RootState["app"]["Test"]["list"]) {
        console.info(`new List ${value} & old List ${prevValue}`)
    }
}
```

## Router Changed
Now we updated `react-router-dom` is [V6](https://reactrouter.com/en/main).

- before
```
import {Route} from "@wonder/core-fe";
import {Switch} from "react-router-dom";

override render() {
    const {location} = this.props;

    return (
        <Switch key={location && location.pathname} location={location}>
            <Route exact key="/" path="/" component={() => <Redirect to="/Template" />} />

            {FTIRoutes.map(route => this.renderRoute(route))}
        </Switch>
    );
}
```

- after

Add new api `Routes`, `cloneRoute`. `<Route />` need wrap with `cloneRoute` function. Than `component` => `Component`.

#### Important change is [`<Outlet />`](https://reactrouter.com/en/main/components/outlet#outlet), if you project have global layout, you need to use `<Outlet />` in `"/"` route.

```
import {Routes, Route, cloneRoute} from "@wonder/core-fe";
import {Navigate, Outlet, useNavigate} from "react-router";


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
};

const MainLayout = () => {
    const pathname = app.store.router(state => state.location.pathname);
    const pageName = pathname === "/Test" ? "Template" : "Test";pageNamepathname
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate(`/${pageName}`)}>Go {pageName} Page</button>
            <Outlet />
        </div>
    );
};


export default () => {
    return (
        <Routes>
            <Route key="/" path="/" element={<MainLayout />}>
                {cloneRoute(<Route caseSensitive key="/" path="/" Component={() => <Navigate to="/Template" />} />)}
                {FTIRoutes.map(route => renderRoute(route))}
            </Route>
        </Routes>
    );
};

```

- removed

In before, because `connected-react-router` dependency, we can lister router change event outsite of `<Router />` component. But `connected-react-router` not support `v6`, so we remove navigationStore state, than remove `navigationPrevented` api. If you need to prevent navigation, you can use `useBlocker` hook. This is [docs](https://reactrouter.com/en/main/hooks/use-blocker) and [example](;;;;;;;;;;https://stackblitz.com/github/remix-run/react-router/tree/main/examples/navigation-blocking?file=src%2Fapp.tsx). It is very easy to use!

like this:
```
const blocker = useBlocker(navigationPrevented)

useEffect(() => {
    if (!navigationPrevented) return;

    const result = window.confirm("Do you want to leave?");
    if (result) {
        blocker.reset?.();
    } else {
        blocker.proceed?.();
    }
}, [blocker, navigationPrevented])
```

## Frequently Asked Questions:
1. Pay attention to the decorator version upgrade support for vite/webpack. Since core-v2 now uniformly uses the new version of decorators, if your project configuration does not support it, decorators may throw errors. Below is the recommended configuration:
   
   For vite:
   ```javascript
   export default defineConfig({
       plugins: [
           react({
               babel: {
                   plugins: [["@babel/plugin-proposal-decorators", {loose: true, version: "2022-03"}]],
               },
           }),
       ],
   });
   ```
   For webpack:
   ```javascript
   "esbuild-loader": "4.2.0",
   ```