import {Interval, Loading, Module, ModuleLocation, register} from "../../../src";
import {initialState} from "./state";
import {RootState} from "../../type/state";

class TemplateModule extends Module<RootState, "Template"> {}

export const page = register(new TemplateModule("Template", initialState));
