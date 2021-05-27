import { CustomError } from "./custom-error";

export class ForbiddenError extends CustomError {
    statusCode = 403

    constructor(public customMessage: string) {
        super('Bad Request Error')
        Object.setPrototypeOf(this, ForbiddenError.prototype)
        this.customMessage = customMessage
    }

    serializeErrors() {
        return [{ message: this.customMessage || "Forbbidden"}]
    }

}