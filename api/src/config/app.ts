const {
  NODE_ENV = 'development',
  APP_PORT = 3000,
  JWT_KEY = 'secret',
  EMAIL_VERIFICATION_REDIRECT = "http://localhost:3000",
  FRONTEND_URL = "http://localhost:3001"
} = process.env

export const IN_PRODUCTION = NODE_ENV === 'production'
export { 
  APP_PORT,
  JWT_KEY,
  EMAIL_VERIFICATION_REDIRECT,
  FRONTEND_URL
 }
 