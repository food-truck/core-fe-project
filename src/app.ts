import { createBrowserHistory, type History } from "history";
import { type Logger, type LoggerConfig, LoggerImpl } from "./Logger";
import { createRootStore } from "./sliceStores";

interface App {
  readonly history: History;
  readonly store: ReturnType<typeof createRootStore>;
  // 暂留记录。不需要另外处理actions
  //   readonly actionHandlers: { [actionType: string]: { handler: ActionHandler; moduleName: string } };
  readonly logger: LoggerImpl;
  loggerConfig: LoggerConfig | null;
  // errorHandler: ErrorHandler;
}

export const app = createApp();
export const logger: Logger = app.logger;

// TODO 待替换成Zustand的dev tools，目前先跑通主流程
// function composeWithDevTools(enhancer: StoreEnhancer): StoreEnhancer {
//     let composeEnhancers = compose;
//     if (process.env.NODE_ENV === "development") {
//         const extension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
//         if (extension) {
//             composeEnhancers = extension({
//                 // Ref: https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Arguments.md#actionsdenylist--actionsallowlist
//                 actionsDenylist: [LOADING_ACTION],
//             });
//         }
//     }
//     return composeEnhancers(enhancer);
// }

function createApp(): App {
  const broswerHistory = createBrowserHistory();
  const store = createRootStore(broswerHistory);

  return {
    history: broswerHistory,
    store,
    logger: new LoggerImpl(),
    loggerConfig: null,
    //  TODO 替换
    // *errorHandler() {},
  };
}
