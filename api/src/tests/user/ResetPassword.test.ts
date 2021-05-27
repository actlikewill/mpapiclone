import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../../config'

export {}
const { forgotPasswordRoute, passwordResetRoute, registerRoute } = global.routes 
const testClient = global.testClient


describe('Initiate Password Reset', () => {
    it('returns 200 status on successful password reset initiation', async () => {
        await testClient
        .post(registerRoute)
        .send({
            name: 'John Doe',
            email: 'john.doe@mailing.com',
            password: 'Passw0rd',
            passwordConfirmation: 'Passw0rd'
        })

        await testClient
            .post(forgotPasswordRoute)
            .send({
              email: 'john.doe@mailing.com',
            })
            .expect(200)
    })

    it('returns 400 with invalid email', async () => {
        await testClient
            .post(forgotPasswordRoute)
            .send({
                email: 'invalidemail'
            })
            .expect(400)
    })

    it('returns 400 with an email with no account associated', async () => {
        await testClient
            .post(forgotPasswordRoute)
            .send({
                email: 'jane.doe@bitmail.com'
            })
            .expect(400)
    })
})

describe('Password Reset', () => {
    it('returns 200 status on successful password reset initiation', async () => {
        const testingToken = jwt.sign({ email: 'john.doe@mailing.com' }, JWT_KEY, { expiresIn: '1h' })

        await testClient
        .post(registerRoute)
        .send({
            name: 'John Doe',
            email: 'john.doe@mailing.com',
            password: 'Passw0rd',
            passwordConfirmation: 'Passw0rd'
        })

        await testClient
            .post(`${passwordResetRoute}?token=${testingToken}`)
            .send({
                password:"Passw9rd",
                passwordConfirmation:"Passw9rd"
            })
            .expect(201)
    })
})
