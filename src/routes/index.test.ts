import request from 'supertest'
import mongoose from 'mongoose'
import { app } from './index'

jest.mock('mongoose', () => ({
    connection: {
        readyState: 1
    }
}))

describe('/ping', () => {

    it('should return 200', async () => {
        const response = await request(app).get('/ping')
        expect(response.status).toBe(200)
    })

    it('should return 503 if the database is disconnected', async () => {
        // @ts-ignore
        mongoose.connection.readyState = 0 // readyState is not a read-only value because it is mocked, ignore this warning
        const response = await request(app).get('/ping')
        expect(response.status).toBe(503)
    })

})
