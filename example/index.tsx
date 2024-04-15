import {bootstrap} from "../src";
import {ErrorHandler} from "./page/ErrorHandler";
import {Main} from "./page/main";

bootstrap({
    componentType: Main,
    errorListener: new ErrorHandler(),
    idleTimeoutInSecond: 10,
});
