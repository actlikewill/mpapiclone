import { Router } from 'express'
import { UserController } from '../controllers'
import { isLoggedIn } from '../middleware'

const UserRouter= Router ()

UserRouter.post ('/register',  UserController.register )

UserRouter.post ('/login', UserController.login )

UserRouter.post('/logout', UserController.logout ) 

UserRouter.get('/verify-email', UserController.verifyEmail ) 

UserRouter.get('/current-user', isLoggedIn, UserController.currentUser )

UserRouter.post('/password/forgot', UserController.forgotPassword);

UserRouter.post('/password/reset', UserController.passwordReset);

const UserBaseRouter = Router().use ( '/user', UserRouter )

export default UserBaseRouter
