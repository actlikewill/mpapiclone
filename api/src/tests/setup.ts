import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { JWT_KEY } from '../config'
import { createApp } from '../app'


declare global {
    namespace NodeJS {
        interface Global {
            signin( testUser: any ): Promise<{user: object, token: string}>
            addCompany( testUser: any, testCompany: any ): Promise<{ token: string, body: any}>
            routes: any
            testClient: any
            testUser: any
            testCompany: any
        }
    }
}

let mongo : any

beforeAll( async () => {
    process.env.JWT_KEY = 'secretkey'

    mongo = new MongoMemoryServer()
    const mongoUri = await mongo.getUri()

    await mongoose.connect( mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()
    for ( let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})

global.testClient = request(createApp().app)

global.routes = {
    loginRoute: '/api/user/login',
    logoutRoute: '/api/user/logout',
    registerRoute: '/api/user/register',
    addCompanyRoute: '/api/company/create',
    deleteCompanyRoute: '/api/company/delete', // TODO: delete company
    updateCompanyRoute: '/api/company/update',
    addCompanyUserRoute: '/api/company/user/add', // TODO: add company users
    updateCompanyUserRoute: '/api/company/user/update', // TODO: edit company users
    deleteCompanyUserRoute: '/api/company/user/delete', // TODO: remove company users
    getOneCompanyRoute: '/api/company', 
}

global.testUser = {
    email: 'test@test.com',
    name: 'test',
    password: 'Passw0rd',
    passwordConfirmation: 'Passw0rd'
}

global.testCompany  = {
    companyName: 'Telkom',
    companyType: 'Vendor',
    companyEmail: 'test@email.com',
    companyPhone: '12345'
}

global.signin = async ( testUser: any ) => {   
    
     const user = await global.testClient
        .post(global.routes.registerRoute)
        .send(testUser)
        .expect(201)

     const response = await global.testClient
        .post(global.routes.loginRoute)
        .send({
            email: testUser.email,
            password: testUser.password
        })
        .expect(200)

        return response.body
}

global.addCompany = async ( testUser, testCompany ) => {
    const { token } = await global.signin( testUser )
    const testClient = global.testClient
    const { addCompanyRoute } = global.routes

    const response = await testClient
        .post(addCompanyRoute)
        .set( 'Authorization', token )
        .send(testCompany)
        .expect(201)

        return { body: response.body, token }
}
