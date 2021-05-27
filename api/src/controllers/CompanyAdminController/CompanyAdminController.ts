import express from 'express'
import BaseController from "../BaseController/BaseController";
import { validate, addCompanyUserSchema, removeCompanyUserSchema } from '../../validation'
import { User, UserDocument } from '../../models'
import { BadRequestError } from '../../errors';


declare global {
    namespace Express {
        interface Request {
            currentUser?: UserDocument
        }
    }
}
class CompanyAdminControllerClass extends BaseController {
    public async addUserToCompany ( req: express.Request, res: express.Response ) {
        
        await validate ( addCompanyUserSchema, req.body )

        const { email, role } = req.body

        if ( email === req.currentUser!.email ) {
            throw new BadRequestError ( "Cannot edit own account" )
        }

        const user = await User.findOne ( { email } )

        if ( ! user ) {
            throw new BadRequestError ( "User does not exist" )
        } else 

        if ( user.company ) {
            throw new BadRequestError ( "User already has company assigned")
        } else {

            user.company =  req.currentUser!.company
            user.role =  role 

            await user!.save ()
            
        return res.status(201).json({ message: 'Company user added', user })

        }
    }

    public async updateCompanyUser (req: express.Request, res: express.Response ) {
        await validate ( addCompanyUserSchema, req.body )

        const { email, role } = req.body

        
        if ( email === req.currentUser!.email ) {
            throw new BadRequestError ( "Cannot edit own account" )
        }

        const user = await User.findOne ( { email } )

        if ( ! user ) {
            throw new BadRequestError ( "User does not exist" )
        } else 

        if ( String (user.company) !== String (req.currentUser!.company) ) {
            throw new BadRequestError ( "User is not company member")
        } else {

            user.role =  role 

            await user!.save ()
            
        return res.status(201).json({ message: 'Company user updated', user })

        }

    }

    public async getAllCompanyUsers (req: express.Request, res: express.Response ) {

        const users = await User.find( {company: req.currentUser!.company })

        return res.status(200).json ( { users } )

        
    }

    public async deleteCompanyUser (req: express.Request, res: express.Response) {

        await validate ( removeCompanyUserSchema, req.body )

        const { email } = req.body

        if ( email === req.currentUser!.email ) {
            throw new BadRequestError ( "Cannot edit own account" )
        }

        const user = await User.findOne ( { email } )

        if ( ! user ) {
            throw new BadRequestError ( "User does not exist" )
        } else 

        if ( String (user.company) !== String (req.currentUser!.company) ) {
            throw new BadRequestError ( "User is not company member")
        } else {

            user.role =  "Unassigned"
            user.company = null 

            await user!.save ()
            
        return res.status(200).json({ message: 'Company user removed', user })

        }

    }
}

export const CompanyAdminController =  new CompanyAdminControllerClass ()