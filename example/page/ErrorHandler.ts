import {ErrorListener, Exception, APIException, SagaGenerator} from "../../src";

export class ErrorHandler implements ErrorListener {
    *onError(exception: Exception): SagaGenerator {
        console.error("server error");
    }
}
