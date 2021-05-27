import { Router } from 'express'
import { CompanyController } from '../controllers'
import { isLoggedIn } from '../middleware'

const CompanyRouter = Router ()

CompanyRouter.post ('/create', isLoggedIn, CompanyController.addCompany )

CompanyRouter.post('/update', isLoggedIn, CompanyController.updateCompany)

CompanyRouter.get ('/all', isLoggedIn, CompanyController.getCompanies )

CompanyRouter.get ('/', isLoggedIn, CompanyController.getCompany )

CompanyRouter.post ('/delete', isLoggedIn, CompanyController.deleteCompany )

const CompanyBaseRouter = Router().use ('/company', CompanyRouter )

export default CompanyBaseRouter