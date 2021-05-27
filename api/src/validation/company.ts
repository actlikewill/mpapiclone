import Joi from '@hapi/joi'
import  { ECompanyType } from '../models'

const companyName = Joi.string().min(3).max(254).trim().required()
const companyType = Joi.string().valid(...Object.values(ECompanyType)).required()
const companyEmail = Joi.string().email().required()
const companyPhone = Joi.string().min(3).max(50).required()


export const companySchema = Joi.object( { companyName, companyType, companyEmail, companyPhone } )

