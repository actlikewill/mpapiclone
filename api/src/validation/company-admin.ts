import Joi from '@hapi/joi'
import { EUserRoles } from '../models'


const email = Joi.string().email().min(8).max(254).lowercase().trim().required()
const role = Joi.string().valid(...Object.values(EUserRoles)).required()

export const addCompanyUserSchema = Joi.object({ email, role })

export const removeCompanyUserSchema = Joi.object({ email })