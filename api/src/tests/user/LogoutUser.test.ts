export {}
const testClient = global.testClient
const { loginRoute, registerRoute, logoutRoute } = global.routes
const testUser = global.testUser

describe('Logout User', () => {
    it('removes the cookie after signout', async () => {
        await testClient
            .post(registerRoute)
            .send(testUser)
            .expect(201)
    
        await testClient
            .post(loginRoute)
            .send({
                email: 'test@test.com',
                password: 'Passw0rd',
            })
            .expect(200)
            
    })
})