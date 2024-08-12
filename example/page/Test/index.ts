import TestComponent from "./Test";
import {page} from "./page";

export const Test = page.attachLifecycle(TestComponent);
export const actions = page.getActions();
