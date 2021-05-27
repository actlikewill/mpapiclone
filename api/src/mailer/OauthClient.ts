import {
    GOOGLE_REFRESH_TOKEN,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI } from '../config'

import { google } from 'googleapis'
 
class OauthClient {
    private createOauth2Client () {

        const OAuth2 = google.auth.OAuth2

        const oauth2Client = new OAuth2(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            GOOGLE_REDIRECT_URI
          )
        
          oauth2Client.setCredentials({
            refresh_token: GOOGLE_REFRESH_TOKEN,
          })

          return oauth2Client
    }

    public getAccessToken () {

        const  OAuth2Client = this.createOauth2Client()
        return OAuth2Client.getAccessToken()
    }
}

export function getAccessToken () {
    if (process.env.NODE_ENV === 'test') {
        return ''
    } else {
        return new OauthClient().getAccessToken()
    }
}

