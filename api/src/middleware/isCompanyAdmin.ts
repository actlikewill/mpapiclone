import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '../errors'
import { UserDocument } from '../models'

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDocument;
    }
  }
}


export const isCompanyAdmin = ( req : Request, res: Response, next: NextFunction ) => {
    
   const { role } =  req.currentUser!

   if ( role !== 'Admin' ) {

    throw new  ForbiddenError ( "Not Admin User" )

   }

   next ()
}
