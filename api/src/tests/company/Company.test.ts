export {}
const testClient = global.testClient
const { addCompanyRoute, updateCompanyRoute, deleteCompanyRoute } = global.routes

const testCompany = {
    companyName: 'Telkom',
    companyType: 'Vendor',
    companyEmail: 'test@email.com',
    companyPhone: '12345'
}

describe ('Company Controller', () => {

    it('returns a 401 if user is not logged in', async () => {
        await testClient
            .post(addCompanyRoute)
            .send(testCompany)
            .expect(401)
            
    })
    
    it('returns 400 with invalid company email', async () => {

        const  { token } =  await global.signin( global.testUser )

        await testClient
            .post(addCompanyRoute)
            .set( 'Authorization', token )
            .send({
                companyName: 'Company',
                companyEmail: 'invalid',
                companyPhone: '12345'
            })
            .expect(400)
    }) 

    
    it('returns 400 with invalid company type', async () => {

        const  { token } =  await global.signin ( global.testUser )

        await testClient
            .post(addCompanyRoute)
            .set( 'Authorization', token )
            .send({
                companyName: 'Company',
                companyEmail: 'test@email.com',
                companyPhone: '12345',
                companyType: 'invalid'
            })
            .expect(400)
    }) 


    it('returns 201 with valid company data', async () => {
        
        const  { token } =  await global.signin ( global.testUser )

        await testClient
            .post(addCompanyRoute)
            .set( 'Authorization', token )
            .send(testCompany)
            .expect(201)
    })

    it('returns 403 with if user already has a company', async () => {
        
        const  { token } =  await global.signin ( global.testUser )

        await testClient
            .post(addCompanyRoute)
            .set( 'Authorization', token )
            .send(testCompany)
            .expect(201)

        await testClient
            .post(addCompanyRoute)
            .set( 'Authorization', token )
            .send(testCompany)
            .expect(403)

    })

    it ('returns 403 if tries to update company with no company assigned', async () => {

        const  { token } =  await global.signin ( global.testUser )

        await testClient
            .post(updateCompanyRoute)
            .set( 'Authorization', token )
            .send(testCompany)
            .expect(403)
    })

    it ('returns 400 if company is valid and update info is invalid', async () => {

        const  { token } =  await global.signin (global.testUser )

        await testClient
            .post(addCompanyRoute)
            .set( 'Authorization', token )
            .send(testCompany)
            .expect(201)

        await testClient
            .post(updateCompanyRoute)
            .set( 'Authorization', token )
            .send(
                {
                    invalid: 'Data',
                }
            )
            .expect(400)
    })

     it ('allows edit if company data is valid and user is allowed', async () => {

        const  { token } =  await global.signin ( global.testUser )

        await testClient
            .post(addCompanyRoute)
            .set( 'Authorization', token )
            .send(testCompany)
            .expect(201)

        await testClient
            .post(updateCompanyRoute)
            .set( 'Authorization', token )
            .send(testCompany)
            .expect(201)

    })
})