import { State } from "../../src";
import { State as MainState } from "../page/main/type";
import { State as TemplateState } from "../page/Template/type";
import { State as OperationState } from "../page/Operation/type";

export interface RootState extends State {
    app: {
        main: MainState;
        Template: TemplateState;
        Operation: OperationState
    };
}
