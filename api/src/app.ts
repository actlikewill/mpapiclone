import express from 'express'
import 'express-async-errors'
import { notFoundHandler, errorHandler } from './middleware'
import routes from './routes'
import cookieSession from 'cookie-session'
import cors from 'cors'

export class App {

  public app : express.Application

  constructor ( 
    app: express.Application,  
    ) {
    this.app = app 
  }

  private initializeHandlers ( handlers : any[]) {
    handlers.forEach ( handler => this.app.use ( handler ) )
  } 

  public listen ( port : number, callback : () => void ) {
    this.app.listen ( port || 3000, callback )
  } 

  public initializeRouteHandlers ( routes: express.RequestHandler[] ) {
    routes.forEach ( route => this.app.use('/api', route))
  }
    
  public initializeMiddleware ( middleware: express.RequestHandler[] ) {
    this.initializeHandlers ( middleware ) 
  }
  
  public initializeErrorHandlers ( errorHandlers: Array <express.ErrorRequestHandler | express.RequestHandler> ) {
    this.initializeHandlers ( errorHandlers )
  }

}

export const createApp = () => {
  
  const app = new App ( express () ) 

  const middleware = [
    express.json(), 
    cookieSession({ signed: false, secure: false}),
    cors()
  ]

  const errorHandlers = [ notFoundHandler, errorHandler ]
  
  app.initializeMiddleware ( middleware )
  
  app.initializeRouteHandlers ( routes )

  app.initializeErrorHandlers ( errorHandlers ) 

  return app 
  
}