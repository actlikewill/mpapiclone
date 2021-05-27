import { Router } from 'express'
import { CompanyAdminController } from '../controllers'
import { isLoggedIn, isCompanyAdmin } from '../middleware'

const CompanyAdminRouter = Router ()

CompanyAdminRouter.post ('/user/add', isLoggedIn, isCompanyAdmin, CompanyAdminController.addUserToCompany )

CompanyAdminRouter.post('/user/update', isLoggedIn, isCompanyAdmin, CompanyAdminController.updateCompanyUser )

CompanyAdminRouter.get ('/user/list', isLoggedIn, isCompanyAdmin, CompanyAdminController.getAllCompanyUsers )

CompanyAdminRouter.post ('/user/delete', isLoggedIn, isCompanyAdmin, CompanyAdminController.deleteCompanyUser  )

const CompanyAdminBaseRouter = Router().use ('/company', CompanyAdminRouter )

export default CompanyAdminBaseRouter