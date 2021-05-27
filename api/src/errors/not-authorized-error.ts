import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
    statusCode = 401
    customMessage : string | undefined

    constructor( customMessage?: string ) {
        super('Not Authorized')
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
        this.customMessage = customMessage
    }

    serializeErrors() {
        return [{ message:  this.customMessage || "Not Authorized" }]
    }

}