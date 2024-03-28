import { app } from "./app";

export const setNavigationPrevented = (isPrevented: boolean) =>
  app.store.setState((draft) => {
    draft.navigationPrevented = isPrevented;
  });

export const setIdleTimeout = (timeout: number) =>
  app.store.setState((draft) => {
    draft.idle.timeout = timeout;
  });

interface SetStatePayload<T = any> {
  moduleName: string;
  state: T;
}

export const setAppState = <T = any>(payload: SetStatePayload<T>, action?: string) => {
  app.store.setState((draft) => {
    draft.app[payload.moduleName] = payload.state;
  });
};

interface LoadingActionPayload {
  identifier: string;
  show: boolean;
}

export const setLoadingState = (payload: LoadingActionPayload) => {
  app.store.setState((draft) => {
    const count = draft.loading[payload.identifier] || 0;
    draft.loading[payload.identifier] = count + (payload.show ? 1 : -1);
  });
};
