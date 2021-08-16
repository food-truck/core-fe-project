## Overview

core-fe is a frontend framework based on react, redux, react-saga, it's designed to support our own projects.

[![Build Status](https://github.com/food-truck/core-fe-project/workflows/build/badge.svg)](https://github.com/food-truck/core-fe-project/actions)

## Basic Features:

The whole website is split into **modules**, usually by routes.

For each module, it contains **1 state** and **some actions**, to handle business logic.

No matter sync or async, every action is automatically wrapped as saga generator.

To extend module features, modules can also implement its own lifecycle actions, like onEnter/onDestroy/onActive etc.

## Advanced Features

(1) Global error handler

(2) Event log collector

(3) Built-in decorator

## Core API:

- startApp

Bootstrap function, configuring entry component / error handler / log / initialization action.

- register

Register a module (including lifecycle actions and custom actions).

## Usage:

(To be done)

## Similar Frameworks

We also develop a same (90% similarity) framework for app, using the same tech stack (in React Native).

https://github.com/food-truck/core-native-project

Our idea is also inspired by many React-based frameworks

https://github.com/dvajs/dva

https://github.com/rematch/rematch

https://github.com/wangtao0101/resa
