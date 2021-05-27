import { ObjectSchema } from '@hapi/joi'
import { RequestValidationError } from '../errors'


export const validate = async ( schema: ObjectSchema, payload: any ) => {
    try {
        await schema.validateAsync ( payload, { abortEarly: false } )
    }

    catch ( error ) {

        throw new RequestValidationError ( error.details )

    }
}