import {ErrorListener, Exception} from "../../src";

export class ErrorHandler implements ErrorListener {
    onError(exception: Exception) {
        console.error(exception);
    }
}
