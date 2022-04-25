import request from 'supertest'
import mongoose from 'mongoose'
import { app } from './index'

describe('/ping', () => {

    it('should return 200', async () => {
        const response = await request(app).get('/ping')
        expect(response.status).toBe(200)
    })

    it('should return 503 if the database is disconnected', async () => {
        await mongoose.disconnect()

        const response = await request(app).get('/ping')
        expect(response.status).toBe(503)
    })

})
