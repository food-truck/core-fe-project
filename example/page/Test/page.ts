import {Interval, Loading, Module, ModuleLocation, register, Subscribe} from "../../../src";
import {initialState} from "./state";
import {RootState} from "../../type/state";

class TemplateModule extends Module<RootState, "Test"> {
}

export const page = register(new TemplateModule("Test", initialState));
