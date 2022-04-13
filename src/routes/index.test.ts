import request from 'supertest'
import mongoose from 'mongoose'
import { app } from './index'

declare global {
    var __MONGO_URI__: string
}

// // suppress error messages
// const mockConsoleError = jest.spyOn(console, 'error')
//     .mockImplementation((err: ErrnoException) => {})

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