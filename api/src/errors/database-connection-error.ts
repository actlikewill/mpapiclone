import { CustomError } from "./custom-error"

export class DatabaseConnectionError extends CustomError {
    reason = 'Database Error'

    statusCode = 500 
    constructor() {
        super('Database Error')
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeErrors () {
        return [
            { message: this.reason }
        ]
    }
}