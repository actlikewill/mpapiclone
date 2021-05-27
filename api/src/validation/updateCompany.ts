import Joi from '@hapi/joi'
import  { ECompanyType } from '../models'

const companyName = Joi.string().min(3).max(254).trim()
const companyType = Joi.string().valid(...Object.values(ECompanyType))
const companyEmail = Joi.string().email()
const companyPhone = Joi.string().min(3).max(50)

export const updateCompanySchema = Joi.object({ companyName, companyType, companyEmail, companyPhone })
