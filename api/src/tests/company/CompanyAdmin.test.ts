export {}
const testClient = global.testClient
const { 
    addCompanyUserRoute, 
    updateCompanyUserRoute, 
    loginRoute, 
    deleteCompanyUserRoute,
    getOneCompanyRoute } = global.routes



describe('Company Admin Controller', () => {

    it ('rejects malformed data', async () => {
        const { token } = await global.addCompany ( global.testUser, global.testCompany )
        await testClient
        .post(addCompanyUserRoute)
        .set('Authorization', token)
        .send({
            email: 'invalidemail',
            role: 'employee'
        })
        .expect(400)
    })

    it ('prevents non admin user from adding users', async () => {

        const newUserData = {
                email: "newUser@email.com",
                name: "newUser",
                password: "Passw0rd",
                passwordConfirmation: "Passw0rd",
            }

        const { token } = await global.signin ( newUserData )

        await testClient 
            .post (addCompanyUserRoute)
            .set('Authorization', token )
            .send({ 
                email: 'newEmployee@email.com',
                role: 'Employee'
            })
            .expect(403)
    })

    it ('disallows addition users who already have companies', async () => {

        const newUserData = {
                email: "newUser@email.com",
                name: "newUser",
                password: "Passw0rd",
                passwordConfirmation: "Passw0rd",
            }
            
        const company1Data = await global.addCompany( global.testUser, global.testCompany )

        await global.addCompany( newUserData, global.testCompany )

        await testClient
            .post(addCompanyUserRoute)
            .set('Authorization', company1Data.token )
            .send({
                email: newUserData.email,
                role: 'Employee'
            })
            .expect(400)
    })


    it ('prevents addition of non existent users', async () => {

        const company1Data = await global.addCompany( global.testUser, global.testCompany )

        await testClient
            .post(addCompanyUserRoute)
            .set('Authorization', company1Data.token )
            .send({
                email: "nonexistent@user.com",
                role: "Employee"
            })
            .expect(400)
    })

    it ('handles addition of existing users', async () => {

        const existingUser = {
                email: "existingUser@email.com",
                name: "existingUser",
                password: "Passw0rd",
                passwordConfirmation: "Passw0rd",
            }
        await global.signin ( existingUser )

        const company1Data = await global.addCompany( global.testUser, global.testCompany )

        await testClient
            .post(addCompanyUserRoute)
            .set('Authorization', company1Data.token )
            .send({
                email: existingUser.email,
                role: "Employee" 
            })
            .expect(201)
    })

    it ('allows editing of company user roles', async () => {

        const existingUser = {
                email: "existingUser@email.com",
                name: "existingUser",
                password: "Passw0rd",
                passwordConfirmation: "Passw0rd",
            }

        await global.signin ( existingUser )

        const company1Data = await global.addCompany( global.testUser, global.testCompany )

        await testClient
            .post(addCompanyUserRoute)
            .set( 'Authorization', company1Data.token )
            .send({
                email: existingUser.email,
                role: "Employee" 
            })
            .expect(201)

        const res = await testClient
            .post(updateCompanyUserRoute)
            .set('Authorization', company1Data.token )
            .send({
                email: existingUser.email,
                role: 'Admin'
            })
            // .expect(201)

        const updatedUser = await testClient
            .post(loginRoute)
            .send({
                email: existingUser.email,
                password: existingUser.password
            })
    
        expect(updatedUser.body.user.role).toBe("Admin")
           
        
    })

    it ('allows removal of users', async () => {

         const existingUser = {
                email: "existingUser@email.com",
                name: "existingUser",
                password: "Passw0rd",
                passwordConfirmation: "Passw0rd",
            }
        await global.signin ( existingUser )

        const company1Data = await global.addCompany( global.testUser, global.testCompany )

        await testClient
            .post(addCompanyUserRoute)
            .set('Authorization', company1Data.token )
            .send({
                email: existingUser.email,
                role: "Employee" 
            })
            .expect(201)
        
        const updatedUser = await testClient
            .post(loginRoute)
            .send({
                email: existingUser.email,
                password: existingUser.password
            })
    
        expect(updatedUser.body.user.role).toBe("Employee")

        await testClient
            .post(deleteCompanyUserRoute)
            .set('Authorization', company1Data.token )
            .send({
                email: existingUser.email
            })
            .expect(200)


        const deletedUser = await testClient
            .post(loginRoute)
            .send({
                email: existingUser.email,
                password: existingUser.password
            })
    
        expect(deletedUser.body.user.role).toBe("Unassigned")
    })

    it ('gets one company', async () => {

        const { token , body : { company } } = await global.addCompany( global.testUser, global.testCompany )

        await testClient
            .get(`${getOneCompanyRoute}?id=`)
            .set('Authorization', token )
            .expect(400)

        await testClient
            .get(`${getOneCompanyRoute}?id=invalidid`)
            .set('Authorization', token )
            .expect(400)

        await testClient
            .get(`${getOneCompanyRoute}?id=${company.id}`)
            .set('Authorization', token )
            .expect(200)
        
    })
})