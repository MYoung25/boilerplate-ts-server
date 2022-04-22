import request from 'supertest'
import mongoose from 'mongoose'
import { app } from './index'
import { Roles } from '../entities/Roles'
import { ErrnoException } from '../app'

declare global {
    var __MONGO_URI__: string
}

// suppress error messages
const mockConsoleError = jest.spyOn(console, 'error')
    .mockImplementation((err: ErrnoException) => {})

describe('/api/Roles', () => {
    let connection: any
    beforeAll(async () => {
        connection = await mongoose.connect(global.__MONGO_URI__ as string)
    });

    afterAll(async () => {
        await connection.disconnect()
    })

    describe('GET', () => {

        beforeAll(async () => {
            await new Roles({}).save()
        })

        afterAll(async () => {
            await Roles.deleteMany({})
        })

        it('returns a 200', async () => {
            const response = await request(app).get('/Roles')
            expect(response.statusCode).toBe(200)
        })

        it('returns all Roless', async() => {
            const response = await request(app).get('/Roles')
            expect(response.body.length).toBe(1)
        })

    })

    describe('POST', () => {

        afterAll(async () => {
            await Roles.deleteMany({})
        })

        it('returns a 201', async () => {
            const response = await request(app).post('/Roles').send({})
            expect(response.statusCode).toBe(201)
        })

        it('returns the new Roles', async () => {
            const response = await request(app).post('/Roles').send({ name: 'Roles' })
            expect(response.body).toHaveProperty('name', 'ROLES')
        })

        it('inserts the new Roles', async () => {
            const response = await request(app).post('/Roles').send({ name: 'Roles' })
            const item = await Roles.findById(response.body._id)
            expect(item).toHaveProperty('name', 'ROLES')
        })
    })

    describe('/:id', () => {
        let item: any

        beforeAll(async () => {
            item = await new Roles({}).save()
        })

        afterAll(async () => {
            await Roles.deleteMany({})
        })

        describe('GET', () => {

            it('returns a 200', async () => {
                const response = await request(app).get(`/Roles/${item._id}`)
                expect(response.statusCode).toBe(200)
            })

            it('returns the Roles', async () => {
                const response = await request(app).get(`/Roles/${item._id}`)
                expect(response.body).toHaveProperty('_id', expect.any(String))
                expect(response.body).toHaveProperty('__v', 0)
            })

            it('returns a 404', async () => {
                const response = await request(app).get(`/Roles/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await request(app).get(`/Roles/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

        })

        describe('PATCH', () => {

            it('returns a 200', async () => {
                const response = await request(app).patch(`/Roles/${item._id}`).send({ name: 'Roles' })
                expect(response.statusCode).toBe(200)
            })

            it('returns the updated Roles', async () => {
                const response = await request(app).patch(`/Roles/${item._id}`).send({ name: 'Superman' })
                expect(response.body).toHaveProperty('name', 'Superman')
            })

            it('returns a 404', async () => {
                const response = await request(app).patch(`/Roles/${new mongoose.Types.ObjectId()}`).send({ name: 'Roles' })
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await request(app).patch(`/Roles/dfghjkkjhgf`).send({ name: 'Roles' })
                expect(response.statusCode).toBe(500)
            })

        })

        describe('DELETE', () => {

            it('returns a 204', async () => {
                const response = await request(app).delete(`/Roles/${item._id}`)
                expect(response.statusCode).toBe(204)
            })

            it('deletes the Roles', async () => {
                await request(app).delete(`/Roles/${item._id}`)
                const found = await Roles.findById(item._id)
                expect(found).toBeNull()
            })

            it('tries to delete a nonexistent Roles', async () => {
                const response = await request(app).delete(`/Roles/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if an error occurs', async () => {
                const response = await request(app).delete(`/Roles/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

        })

    })

})
