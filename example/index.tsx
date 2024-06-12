import {bootstrap} from "../src";
import {ErrorHandler} from "./page/ErrorHandler";
import {Main} from "./page/main";

bootstrap({
    componentType: Main,
    errorListener: new ErrorHandler(),
    idleTimeoutInSecond: 10,
    loggerConfig: {
        serverURL: 'https://event.foodtruck-qa.com/event/pantry-site',
        maskedKeywords: [/^cvc$/, /^cardNumber$/, /^expiration_year$/, /^expiration_month$/, /^expirationDate$/, /[Pp]assword/],
    },
});
