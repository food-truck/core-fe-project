import MainComponent from "./Main";
import {page} from "./page";

export const actions = page.getActions();
export const Main = page.attachLifecycle(MainComponent);
