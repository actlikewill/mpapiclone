export {}
const { registerRoute } = global.routes 
const testClient = global.testClient

describe('Register User', () => {
    it('returns 201 status on successful signup', async () => {
        await testClient
            .post(registerRoute)
            .send({
                name: 'test',
                email: 'test@test.com',
                password: 'Passw0rd',
                passwordConfirmation: 'Passw0rd'
            })
            .expect(201)
    })

    it('returns 400 with invalid email', async () => {
        return testClient
            .post(registerRoute)
            .send({
                email: 'invalidemail',
                name: 'test',
                password: 'Passw0rd',
                passwordConfirmation: 'Passw0rd'
            })
            .expect(400)
    })

    it('returns 400 with invalid password', async () => {
        return testClient
            .post(registerRoute)
            .send({
                name: 'test',
                email: 'test@test.com',
                password: 'Pasrd',
                passwordConfirmation: 'Pasrd'
            })
            .expect(400)
    })


    it('returns 400 with no email and password', async () => {
        return testClient
            .post(registerRoute)
            .send({})
            .expect(400)
    })

    it('disallows duplicate emails', async () => {

        await testClient
            .post('/api/user/register')
            .send({
                name: 'test',
                email: 'test@test.com',
                password: 'Passw0rd',
                passwordConfirmation: 'Passw0rd'
            })
            .expect(201)

        await testClient
            .post(registerRoute)
            .send({
                name: 'test',
                email: 'test@test.com',
                password: 'Passw0rd',
                passwordConfirmation: 'Passw0rd'
            })
            .expect(400)
    })

    it('responds with userCreated after succesful signup', async () => {

        const response = await testClient
            .post(registerRoute)
            .send({
                name: 'test',
                email: 'test@test.com',
                password: 'Passw0rd',
                passwordConfirmation: 'Passw0rd'
            })

        expect(response.body.message).toBeDefined()
    })
})