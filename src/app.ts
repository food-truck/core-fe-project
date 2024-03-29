import { createBrowserHistory, type History } from "history";
import { type Logger, type LoggerConfig, LoggerImpl } from "./Logger";
import { createRootStore, type State } from "./sliceStores";
import type { ErrorHandler } from "./module";


interface App {
  readonly history: History;
  readonly store: ReturnType<typeof createRootStore>;
  readonly logger: LoggerImpl;
  loggerConfig: LoggerConfig | null;
  errorHandler: ErrorHandler;
  getState: <K extends keyof State>(key: K) => State[K]
}

export const app = createApp();
export const logger: Logger = app.logger;

function createApp(): App {
  const broswerHistory = createBrowserHistory();
  const store = createRootStore(broswerHistory);

  return {
    getState: key => app.store.getState()[key],
    history: broswerHistory,
    store,
    logger: new LoggerImpl(),
    loggerConfig: null,
    errorHandler() { },
  };
}
