## 1.5.1.0-beta.1

### 2024.3.14

### Background

- Since most of the existing project is still based on the old decorators, we have added the API tracking feature on top of version 1.5.0.

### Api tracking

- Added network (API) tracking functionality as an optional feature for core-fe. When an API request, it will record info and error logs for log analysis.

- Due to different projects having different error format responses from the backend, an error handling mechanism has been added.

    - change type of APIErrorResponse

- Create a new uploadLog function to upload logs.

- use app.loggerConfig.apiTracking to open the API tracking feature.

## 1.7.0-beta.1

### 2024.3.14

### Api tracking

- Added network (API) tracking functionality as an optional feature for core-fe. When an API request, it will record info and error logs for log analysis.

- Due to different projects having different error format responses from the backend, an error handling mechanism has been added.

    - change type of APIErrorResponse

- Create a new uploadLog function to upload logs.

- use app.loggerConfig.apiTracking to open the API tracking feature.

## 1.7.0

### 2023.11.27

- merged from Core-FE@1.37.0

### Break changes:

- use redux-first-history to replace connect-redux-router

## 1.6.2

### 2023.11.02

- merged from Core-FE@1.36.6

## 1.6.1

### 2023.10.25

- minor fix

## 1.6.0

### 2023.10.25

- merged from Core-FE@1.36.2

### Break changes:

- refactor decorators

## 1.5.0

### 2023.06.15

- merged from Core-FE@1.35.2

### Break changes:

- upgrade to Typescript 5

- Should use @babel/plugin-proposal-decorators to support new decorator

    - in vite project, @vitejs/plugin-react-swc is no longer useful, use @vitejs/plugin-react and add
    - ````javascript
    react({
        babel: {
            plugins: [["@babel/plugin-proposal-decorators", {loose: true, version: "2022-03"}]],
        }
    })
    ````

## 1.4.0

### 2022.11.10

- merged from Core-FE@1.34.0

## Break changes:

- moved to pnpm

- not export axios anymore, should add interceptor in ajax request

## 1.3.1

### 2022.8.2

- merged from Core-FE@1.33.4

- upgrade to React 18.2

## 1.3.0

### 2022.6.29

- Break changes:

- add promise function

- support React 18

### Features:

- merged from Core-FE@1.33.3

    - Upgrade React 18 and other deps minor upgrade, treat ajax() non JSON response as NetworkException.

    - Redesign bootstrap versionConfig frequency, and some minor renames.

    - Redesign network error flow, for better NetworkConnectionException info.

    - Deprecate some jest/redux-dev-tools old usages.

## 1.3.0.beta.1

## 2022.1.21

- add promise function for core-fe@1.3.0.beta.1

## 1.2.0

### 2022.1.21

- merged from Core-FE@1.32.2

## 1.1.1

### 2022.1.21

- fix @types/history conflict

## 1.1.0

### 2021.10.21

- merged from Core-FE@1.31.2

## 1.0.0

### 2021.08.16

- forked from Core-FE@1.29.1
