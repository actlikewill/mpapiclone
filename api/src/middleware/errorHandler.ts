import { ErrorRequestHandler } from "express";
import * as Err from '../errors'
import { CustomError } from "../errors/custom-error";

export const errorHandler : ErrorRequestHandler = ( err, req, res, next ) => {
    // console.log('Something went wrong', err)

    if (err instanceof CustomError) {

        return res.status(err.statusCode).json({ errors: err.serializeErrors() })

    }

    res.status(500).json({
        errors: [{message: 'Server Error', trace: JSON.stringify(err.stack)}] })

}