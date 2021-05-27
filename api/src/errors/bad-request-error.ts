import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
    statusCode = 400

    constructor(public customMessage: string) {
        super('Bad Request Error')
        Object.setPrototypeOf(this, BadRequestError.prototype)
        this.customMessage = customMessage
    }

    serializeErrors() {
        return [{ message: this.customMessage || "Invalid Request"}]
    }

}