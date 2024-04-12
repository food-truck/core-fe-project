import Component from "./Operation";
import {page} from "./page";

export const Page = page.attachLifecycle(Component);
export const actions = page.getActions();
