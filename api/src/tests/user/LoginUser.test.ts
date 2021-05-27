export {}
const testClient = global.testClient
const { loginRoute, registerRoute } = global.routes
const testUser = global.testUser



describe ('Login User', () => {
    it ('fails with an email that does not exist', async () => {
        await testClient
            .post(loginRoute)
            .send(testUser)
            .expect(400)
    })

    
    it ('fails with an invalid password', async () => {
        await testClient
            .post(registerRoute)
            .send(testUser)
            .expect(201)

        await testClient
            .post(loginRoute)
            .send({
                email: 'test@test.com',
                password: 'invalidpassword'
            })
            .expect(400)
    })


    it ('returns a token with valid credentials', async () => {
        await testClient
            .post(registerRoute)
            .send(testUser)
            .expect(201)

        const response = await testClient
            .post(loginRoute)
            .send({
                email: 'test@test.com',
                password: 'Passw0rd'
            })
            .expect(200)

        expect(response.body.token).toBeDefined()

    })
})
