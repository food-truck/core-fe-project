import TemplateComponent from "./Template";
import {page} from "./page";

export const Template = page.attachLifecycle(TemplateComponent);
export const actions = page.getActions();
