import type {State} from "../reducer";

export interface RootState extends State {
    app: {
        [key: string]: {
            [key: string]: any;
        };
    };
}
