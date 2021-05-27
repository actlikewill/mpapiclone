import chalk from 'chalk'
import mongoose from 'mongoose'
import { createApp } from './app'
import { 
   MONGO_URI,
   MONGO_OPTIONS,
   APP_PORT,
   GOOGLE_REFRESH_TOKEN,
   GOOGLE_CLIENT_SECRET,
   GOOGLE_CLIENT_ID
   } from './config'
   
   // if (
   // ! GOOGLE_REFRESH_TOKEN ||
   // ! GOOGLE_CLIENT_SECRET ||
   // ! GOOGLE_CLIENT_ID
   // ) {
   //    console.log({GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN})
   //    throw new Error('GOOGLE ENV VARIABLES MISSING')
   // }

;(async () => {
   try {

   await mongoose.connect( MONGO_URI, MONGO_OPTIONS )
      .then ( () => console.log ( chalk.green ( 'Database Connected !!') ) )
      .catch ( e => { 
         throw new Error ( e ) 
      } )

      const app = createApp ( ) 
      
      app.listen ( +APP_PORT, () => console.log(`App listening on PORT ${APP_PORT}`) )
   }
   catch (e) {

      console.error (e)
      process.exit(1)

   }
      
   })()
   
// process.on('uncaughtExeption', (e) => {
//    console.error('UncaughtError!', e)

// })  
