import { isValidObjectId } from 'mongoose'

import BaseController from "../BaseController/BaseController"
import { Company, User, UserDocument } from '../../models'
import { validate, companySchema,updateCompanySchema } from '../../validation'
import express from 'express'
import { ForbiddenError } from "../../errors/forbidden-error"
import { BadRequestError } from "../../errors"

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

class CompanyControllerClass extends BaseController {

    public async addCompany ( req: express.Request, res: express.Response) {

        
        const companyData = req.body
        
        const currentUserCompany = req.currentUser!.company
        
        const currentUserRole = req.currentUser!.role
        
        if ( ! currentUserCompany && currentUserRole === "Unassigned") {

            await validate ( companySchema, req.body )
            
            const company = await Company.create( companyData )

            const user = await User.findByIdAndUpdate(
                req.currentUser!.id,
                { company: company.id, 
                  role: 'Admin'
                },
                { new: true,
                  runValidators: true,
                  useFindAndModify: false
                })
            
            return res.status(201).json({ message: 'company added', company, user})

        } else  {

            throw new ForbiddenError ("User already has assigned company role")
        }
    }
    
    public async updateCompany ( req: express.Request, res: express.Response) {


        const companyData = req.body
        
        const currentUserCompany = req.currentUser!.company
        
        const currentUserRole = req.currentUser!.role
        
        if ( !! currentUserCompany && currentUserRole === "Admin") {

            await validate ( updateCompanySchema, req.body )

            const company = await Company.findByIdAndUpdate( 
                currentUserCompany, 
                companyData ,
                { new: true, 
                  runValidators: true,
                  useFindAndModify: false
                })

            return res.status(201).json({ message: 'company updated', company})

        }
        else {
            throw new ForbiddenError ("action not allowed, you do not have a company assigned or you do not have edit permission ")
        }
    }


    public async getCompanies ( req: express.Request, res: express.Response) {

        const companies = await Company.find({})

        return res.status(200).json(companies)

    }

    public async getCompany ( req: express.Request, res: express.Response ) {
        try {

            const { id } = req.query

            if ( ! id || ! isValidObjectId ( id ) ) {
                throw new Error ('Invalid company id')
            }

            const company = await Company.findById ( id )

            if ( ! company ) {
                throw new Error ('Company not found')
            }

            return res.status(200).json ( { company } )

        }
         
        catch ( error ) {

            throw new BadRequestError ( error.message )

        }


    }

    public async deleteCompany ( req: express.Request, res: express.Response ) {

        return res.status(200).json({ message: 'cannot delete company'})
    }
}

export const CompanyController = new CompanyControllerClass()