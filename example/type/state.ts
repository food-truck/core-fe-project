import {State} from "../../src";
import {State as MainState} from "../page/main/type";
import {State as TemplateState} from "../page/Template/type";

export interface RootState extends State {
    app: {
        main: MainState;
        Template: TemplateState;
    };
}