import { RequestHandler } from "express"
import { User } from '../models'
import { JWT_KEY } from '../config'
import jwt from 'jsonwebtoken'
import { NotAuthorizedError } from "../errors"
import { UserDocument } from '../models'

interface UserPayload {
    id: string
    email: string
}


export const isLoggedIn : RequestHandler = async ( req, res, next ) => {


    const token = req.headers.authorization

    if ( ! token ) {
        throw new NotAuthorizedError( "No token provided")
    }

    try {

    const payload = jwt.verify( token, JWT_KEY ) as UserPayload

    const found = await User.findOne ( { email: payload.email } )

        if ( ! found ) {
            throw new NotAuthorizedError ( "User not Found" )
        }

    req.currentUser = found

    }

    catch (e) {

        throw new NotAuthorizedError( e.message )

    }

    next()
}