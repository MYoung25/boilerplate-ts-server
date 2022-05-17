import mongoose from 'mongoose'
import request from 'supertest'
import { app } from './index'
import { Filters } from '../entities/Filters'
import { ErrnoException } from '../app'

// suppress error messages
jest.spyOn(console, 'error')
    .mockImplementation((err: ErrnoException) => {})

describe('/api/Filters', () => {

    describe('GET', () => {

        it('returns a 200', async () => {
            const response = await request(app).get('/Filters')
            expect(response.statusCode).toBe(200)
        })

        it('returns all Filterss', async() => {
            const response = await request(app).get('/Filters')
            expect(response.body.length).toBe(1)
        })

    })

    describe('POST', () => {
            
        it('returns a 201', async () => {
            const response = await request(app).post('/Filters').send({})
            expect(response.statusCode).toBe(201)
        })

        it('returns the new Filters', async () => {
            const response = await request(app).post('/Filters').send({ name: 'Filters' })
            expect(response.body).toHaveProperty('name', 'Filters')
        })

        it('inserts the new Filters', async () => {
            const response = await request(app).post('/Filters').send({ name: 'Filters' })
            const item = await Filters.findById(response.body._id)
            expect(item).toHaveProperty('name', 'Filters')
        })
    
    })

    describe('/:id', () => {
        let item: any

        beforeAll(async () => {
            item = await new Filters({}).save()
        })

        afterAll(async () => {
            await Filters.deleteMany({})
        })

        describe('GET', () => {

            it('returns a 200', async () => {
                const response = await request(app).get(`/Filters/${item._id}`)
                expect(response.statusCode).toBe(200)
            })

            it('returns the Filters', async () => {
                const response = await request(app).get(`/Filters/${item._id}`)
                expect(response.body).toHaveProperty('_id', expect.any(String))
                expect(response.body).toHaveProperty('__v', 0)
            })

            it('returns a 404', async () => {
                const response = await request(app).get(`/Filters/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await request(app).get(`/Filters/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

        })

        describe('PATCH', () => {

            it('returns a 200', async () => {
                const response = await request(app).patch(`/Filters/${item._id}`).send({ name: 'Filters' })
                expect(response.statusCode).toBe(200)
            })

            it('returns the updated Filters', async () => {
                const response = await request(app).patch(`/Filters/${item._id}`).send({ name: 'Superman' })
                expect(response.body).toHaveProperty('name', 'Superman')
            })

            it('returns a 404', async () => {
                const response = await request(app).patch(`/Filters/${new mongoose.Types.ObjectId()}`).send({ name: 'Filters' })
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await request(app).patch(`/Filters/dfghjkkjhgf`).send({ name: 'Filters' })
                expect(response.statusCode).toBe(500)
            })

        })

        describe('DELETE', () => {

            it('returns a 204', async () => {
                const response = await request(app).delete(`/Filters/${item._id}`)
                expect(response.statusCode).toBe(204)
            })

            it('deletes the Filters', async () => {
                await request(app).delete(`/Filters/${item._id}`)
                const found = await Filters.findById(item._id)
                expect(found).toBeNull()
            })

            it('tries to delete a nonexistent Filters', async () => {
                const response = await request(app).delete(`/Filters/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if an error occurs', async () => {
                const response = await request(app).delete(`/Filters/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

        })
    
    })

})
