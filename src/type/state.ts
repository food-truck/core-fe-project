import type { State } from "../sliceStores";

export interface RootState extends State {
    app: {
        [key: string]: {
            [key: string]: any;
        };
    };
}
