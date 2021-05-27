import path from 'path'
import nodemailer from 'nodemailer'
import { google, } from "googleapis"
import Email from 'email-templates'
import {
   GOOGLE_REFRESH_TOKEN,
   GOOGLE_CLIENT_SECRET,
   GOOGLE_CLIENT_ID,
   GOOGLE_USER } from '../config'
import { getAccessToken } from './OauthClient'



interface TemplateOptions<TemplateLocals> {
    template: string,
    message : {
        from: string
        to: string[]
    }
    locals: TemplateLocals
  }
  
class MailerClass {

    transport: any

    emailTemplate: any

    accessToken: any

    constructor ( accessToken: any ) {
       this.accessToken = accessToken
        this.transport = this.createTransport( accessToken )
        this.emailTemplate = this.createEmailTemplate()
    }

    private createTransport ( accessToken: any) {

        return nodemailer.createTransport ({
            service: "gmail",
            auth: {
                accessToken: this.accessToken,
                type: "OAuth2",
                user: GOOGLE_USER, 
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
            }
        })
    }


    private createEmailTemplate () {

    return new Email({
        views: {
            root: path.resolve(__dirname, 'emails')
        },
        juice: true,
        juiceSettings: {
            tableElements: ['TABLE']
        },
        juiceResources: {
            preserveImportant: true,
            webResources: {
                relativeTo: path.resolve(__dirname, 'emails')
            }
        },
        send: true,
        transport: this.transport 
        })

    }

    public sendEmailWithTemplate<T> ( templateOptions : TemplateOptions<T> ) : Promise<any> {
        
        return this.emailTemplate.send( templateOptions )

    }
}

class MockMailer {
    public sendEmailWithTemplate () {
    }
}

function setMailer () {
    if (process.env.NODE_ENV === 'test') {
        return new MockMailer ()
    } else {
        return new MailerClass ( getAccessToken () )
    }
}

export const Mailer = setMailer ()