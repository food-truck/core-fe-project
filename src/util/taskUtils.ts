export const processTaskAsync = (handler: (signal: AbortSignal) => Promise<any>): AbortController => {
    const controller = new AbortController();

    handler(controller.signal);

    return controller;
};
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
