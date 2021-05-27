import express from "express";
import BaseController  from "../BaseController/BaseController";
import { validate, loginSchema, registerSchema, forgotPasswordSchema, passwordResetSchema } from '../../validation'
import { User } from '../../models'
import { BadRequestError } from '../../errors'
import jwt from 'jsonwebtoken'
import { JWT_KEY, EMAIL_VERIFICATION_REDIRECT, FRONTEND_URL } from '../../config'
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

    public async sendPasswordResetEmail (frontendUrl: string, user: any, token: string) {
        try {
          const resetLink = `${frontendUrl}/reset-password/${token}`

          await Mailer.sendEmailWithTemplate<{name: string, link: string}> ({
            template: "password_reset",
            message: {
               to: [user.email],
               from: 'TelkomHuduma@digitalHuduma.co.ke'
            },
           locals: {
               name: user.name,
               link: resetLink
           }
         })
        } catch (e) {
           throw new Error ( e )
       }
   }

    public async forgotPassword (req: express.Request, res: express.Response) {
        await validate (forgotPasswordSchema, req.body)

        const { email } = req.body
        const user = await User.findOne ({ email })
        if (!user) {
            throw new BadRequestError(`Sorry, there is no account associated with ${email}`)
        }

        const token = jwt.sign({ email: user.email }, JWT_KEY, { expiresIn: '24h' })
        await UserController.sendPasswordResetEmail(FRONTEND_URL, user, token)
        return res.status(200).json({ message: 'Your account password reset has been initiated. Kindly check your email to reset your password.', token })
    }

    public async passwordReset (req: express.Request, res: express.Response) {
      try {
        await validate (passwordResetSchema, req.body)

        const { token } = req.query;
        const { password } = req.body

        if (!token) {
            throw new BadRequestError('Invalid token. Kindly  re-initiate password reset.')
        }

        const { email } = jwt.verify(token!.toString(), JWT_KEY) as UserPayload
        const user = await User.findOneAndUpdate({ email }, { password }, { useFindAndModify: false })

        if (!user) {
            throw new BadRequestError(`Sorry, there is no account associated with ${email}`)
        }

        return res.status(201).json({
            message: `You've successfully reset your account's password. Log in with your new password.`,
            user
        })
      } catch (error) {
          if (
            error.name === 'TokenExpiredError'
            || error.name === 'JsonWebTokenError'
          ) {
              throw new BadRequestError('Sorry! Link has expired. Kindly re-initiate password reset.')
          }
        }
    }
}

export const UserController = new  UserControllerClass ()


