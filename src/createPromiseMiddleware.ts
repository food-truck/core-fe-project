type PromiseActionMap = {
    [key: string]: {
        resolve: (value: any) => void;
        reject: (value: any) => void;
    };
};

export default function createPromiseMiddleware() {
    const map: PromiseActionMap = {};
    const middleware = () => (next: (arg0: any) => void) => (action: {type: string}) => {
        const {type} = action;

        if (notModuleDefaultProperties(type)) {
            return new Promise((resolve, reject) => {
                map[type] = {
                    resolve: wrapped.bind(null, type, resolve),
                    reject: wrapped.bind(null, type, reject),
                };
            });
        } else {
            return next(action);
        }
    };

    function notModuleDefaultProperties(type: string | string[]) {
        return !type?.includes("@@");
    }

    function wrapped(type: string, fn: (arg0: any) => void, args: any) {
        if (map[type]) delete map[type];
        fn(args);
    }

    function resolve(map: PromiseActionMap, type: string, args: any) {
        if (map[type]) {
            map[type].resolve(args);
        }
    }

    function reject(map: PromiseActionMap, type: string, args: any) {
        if (map[type]) {
            map[type].reject(args);
        }
    }

    return {
        middleware,
        resolve,
        reject,
        map,
    };
}
