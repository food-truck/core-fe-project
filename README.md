## Overview

core-fe is a frontend framework based on react, redux, react-saga, it's designed to support our own projects.

[![Build Status](https://github.com/neowu/core-fe-project/workflows/build/badge.svg)](https://github.com/neowu/core-fe-project/actions)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/neowu/core-fe-project.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/neowu/core-fe-project/context:javascript)

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

## Migrating to v2
In v2, we made some changes, removing redux, redux-saga, generate syntax, etc. and replacing them with new libraries such as zustand.

In the Module, since we ditched redux-saga, we can use normal async, await syntax to handle business scenarios.
- before
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
- after 
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
When using an action, you can call the function on the action directly without using a hook or dispatch.
- before
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
- after
```
import {actions} from "..";

function Example() {
    return (
        <button onClick={actions.fetchList}>Fetch List</button>
    );
}
```
