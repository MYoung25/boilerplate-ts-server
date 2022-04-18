import request from 'supertest'
import mongoose from 'mongoose'
import { app } from './index'
import passport from 'passport'

declare global {
    var __MONGO_URI__: string
}



describe('/ping', () => {
    let connection: any
    beforeAll(async () => {
        connection = await mongoose.connect(global.__MONGO_URI__ as string)
    });

    afterAll(async () => {
        await connection.disconnect()
    })

    it('should return 200', async () => {
        const response = await request(app).get('/ping')
        expect(response.status).toBe(200)
    })

    it('should return 503 if the database is disconnected', async () => {
        await connection.disconnect()
        const response = await request(app).get('/ping')
        expect(response.status).toBe(503)
    })

})

describe('Passport authentication', () => {
    const useMock = jest.fn()
    app.use = useMock
    
    let connection: any
    beforeAll(async () => {
        connection = await mongoose.connect(global.__MONGO_URI__ as string)
    });

    afterAll(async () => {
        await connection.disconnect()
    })




    it('initializes passport', async () => {
        expect.assertions(1)
        // app.use(() => {})
        console.log(app.use)
        expect(useMock).toHaveBeenCalled()
    })

})
