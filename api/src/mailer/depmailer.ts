import path from 'path'
import { createTransport, SendMailOptions, SentMessageInfo, Transport } from "nodemailer"
import { google } from "googleapis"
import Email from 'email-templates'
import {
   GOOGLE_REFRESH_TOKEN,
   GOOGLE_CLIENT_SECRET,
   GOOGLE_CLIENT_ID } from '../config'

const transport = () => {

  const transportVersion = Math.floor(Math.random() * 4000)

  console.log({transportVersion})

  const OAuth2 = google.auth.OAuth2

  const oauth2Client = new OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  )

  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
  })

  const accessToken = oauth2Client.getAccessToken()

  const transporter = createTransport({
    service: "gmail",
    auth: {
      accessToken,
      type: "OAuth2",
      user: "igov.developers@gmail.com",
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GOOGLE_REFRESH_TOKEN,
    },
  } as any)

  return transporter

}

export const sendMail = async (options: SendMailOptions): Promise<SentMessageInfo> => {

  return transport().sendMail({
    ...options,
    from: "Telkom <wilson@digitalhuduma.co.ke>",
    replyTo: "wilson@digitalhuduma.co.ke"
  })
}

interface TemplateOptions {
  template: string,
  to: string[]
  name: string
}

export const sendEmailWithTemplate = async ({ template, to, name } : TemplateOptions ) => {

  const templateVersion = Math.floor(Math.random() * 4000)

  console.log({templateVersion})

const transporter: any = transport()

const email = new Email({
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
  transport: transporter
});

  return email
  .send({
    template,
    message: {
    from: 'Telkom@digitalhuduma.co.ke',
      to
    },
    locals: {
      name
  }
})
  .then(console.log)
  .catch(console.error)
}

