import { app } from "./app";
import type { IdleSlice } from "./sliceStores";

export const setNavigationPrevented = (isPrevented: boolean) =>
  app.store.setState((draft) => {
    draft.navigationPrevented = isPrevented;
  });

export const setIdleTimeout = (timeout: number) =>
  app.store.setState((draft) => {
    draft.idle.timeout = timeout;
  });

export const setIdleState = (state: IdleSlice["idle"]["state"] = "active") => {
  app.store.setState((draft) => {
    draft.idle.state = state;
  })
}

interface SetStatePayload<T = any> {
  moduleName: string;
  state: T;
}

export const setAppState = <T = any>(payload: SetStatePayload<T>) => {
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
