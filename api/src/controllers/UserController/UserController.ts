import express from "express";
import BaseController  from "../BaseController/BaseController";
import { validate, loginSchema, registerSchema } from '../../validation'
import { User } from '../../models'
import { BadRequestError } from '../../errors'
import jwt from 'jsonwebtoken'
import { JWT_KEY, EMAIL_VERIFICATION_REDIRECT } from '../../config'
import { UserDocument } from '../../models'
import { Mailer } from "../../mailer";


interface UserPayload {
    id: string
    email: string
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserDocument
        }
    }
}

class UserControllerClass extends BaseController {
    constructor () {
        super()
    }

    public async register ( req: express.Request, res: express.Response ) {

        await validate ( registerSchema, req.body )

        const { email, name, password } = req.body

        const found = await User.exists ( { email } )

        if ( found ) {
            throw new BadRequestError ( "User already Exists" )
        }

        const user =   await User.create ( { 
            email, name, password
        } ) 

        await UserController.sendVerificationEmail ( req.protocol, req.headers.host, user )

        return res.status(201).json({ message: 'userCreated', user })
    }

     public async sendVerificationEmail ( protocol: any, hostname: any, user: any) {

         try {
         const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
           }, JWT_KEY )

        const link = `${protocol}://${hostname}/api/user/verify-email?token=${token}`

        await Mailer.sendEmailWithTemplate<{name: string, link: string}> ({
            template: "verify_email",
            message: {
                to: [user.email],
                from: 'TelkomHuduma@digitalHuduma.co.ke'
            },
            locals: {
                name: user.name,
                link
            }
        })
        } catch (e) {
            throw new Error ( e )
        }
    }


    public async login ( req: express.Request , res: express.Response ) {

        await validate ( loginSchema, req.body ) 

        const { email, password } = req.body
    
        const user = await User.findOne ( { email } )
    
        const passwordMatch = await user?.matchesPassword ( password )
    
        if ( ! user || ! passwordMatch ) {
           
            throw new BadRequestError ( 'Invalid Credentials' )
    
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            company: user.company
            }, JWT_KEY )

   
        res.status(200).json({ user , token })
    }


    public async logout ( req: express.Request, res: express.Response ) {
       
        return res.status(200).json ( { message: "user logged out" } )

    }

    public async currentUser ( req: express.Request, res: express.Response ) {

        const user = await User.findById(req.currentUser!.id).populate("company")
       
        res.status(200).json ( { currentUser: user } )


    }

    public async verifyEmail ( req: express.Request, res: express.Response ) {

       try {

        const { token } = req.query

        const payload = jwt.verify( token!.toString(), JWT_KEY ) as UserPayload

        const user = await User.findOneAndUpdate ( 
            { email: payload.email }, 
            { isEmailVerified: true }, 
            { new: true, useFindAndModify: false} 
            )

        if ( ! user ) {

            throw new Error ( "User Not Found" )
        }

        res.redirect( EMAIL_VERIFICATION_REDIRECT )

        } catch (e) {

            throw new BadRequestError ( e.message )
        }
    }
}

export const UserController = new  UserControllerClass ()


