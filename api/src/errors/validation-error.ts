// import { ValidationError } from 'express-validator'
import { CustomError } from './custom-error'

export class RequestValidationError extends CustomError {
    statusCode = 400
    constructor( public errors: any[]) {
        super('Validation Error')
        Object.setPrototypeOf(this, RequestValidationError.prototype)
        
    }
    serializeErrors() {
        return this.errors.map(err => ({ message: err.message, field: err.context.label}))
        // console.log(this.errors)
        // return [{message: 'errors', field: ""}]
    }

}