import request from 'supertest'
import mongoose from 'mongoose'
import { app } from './index'
import { Permissions } from '../entities/Permissions'
import { ErrnoException } from '../app'

declare global {
    var __MONGO_URI__: string
}

// suppress error messages
const mockConsoleError = jest.spyOn(console, 'error')
    .mockImplementation((err: ErrnoException) => {})

describe('/api/Permissions', () => {
    let connection: any
    beforeAll(async () => {
        connection = await mongoose.connect(global.__MONGO_URI__ as string)
    });

    afterAll(async () => {
        await connection.disconnect()
    })

    describe('GET', () => {

        beforeAll(async () => {
            await new Permissions({}).save()
        })

        afterAll(async () => {
            await Permissions.deleteMany({})
        })

        it('returns a 401 if not logged in', async () => {
            const response = await request(app).get('/Permissions')
            expect(response.statusCode).toBe(401)
        })

        it('returns a 200', async () => {
            const response = await request(app).get('/Permissions')
            expect(response.statusCode).toBe(200)
        })

        it('returns all Permissionss', async() => {
            const response = await request(app).get('/Permissions')
            expect(response.body.length).toBe(1)
        })

    })

    describe('POST', () => {

        afterAll(async () => {
            await Permissions.deleteMany({})
        })

        it('returns a 201', async () => {
            const response = await request(app).post('/Permissions').send({})
            expect(response.statusCode).toBe(201)
        })

        it('returns the new Permissions', async () => {
            const response = await request(app).post('/Permissions').send({ name: 'Permissions' })
            expect(response.body).toHaveProperty('name', 'Permissions')
        })

        it('inserts the new Permissions', async () => {
            const response = await request(app).post('/Permissions').send({ name: 'Permissions' })
            const item = await Permissions.findById(response.body._id)
            expect(item).toHaveProperty('name', 'Permissions')
        })

    })

    describe('/:id', () => {
        let item: any

        beforeAll(async () => {
            item = await new Permissions({}).save()
        })

        afterAll(async () => {
            await Permissions.deleteMany({})
        })

        describe('GET', () => {

            it('returns a 200', async () => {
                const response = await request(app).get(`/Permissions/${item._id}`)
                expect(response.statusCode).toBe(200)
            })

            it('returns the Permissions', async () => {
                const response = await request(app).get(`/Permissions/${item._id}`)
                expect(response.body).toHaveProperty('_id', expect.any(String))
                expect(response.body).toHaveProperty('__v', 0)
            })

            it('returns a 404', async () => {
                const response = await request(app).get(`/Permissions/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await request(app).get(`/Permissions/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

        })

        describe('PATCH', () => {

            it('returns a 200', async () => {
                const response = await request(app).patch(`/Permissions/${item._id}`).send({ name: 'Permissions' })
                expect(response.statusCode).toBe(200)
            })

            it('returns the updated Permissions', async () => {
                const response = await request(app).patch(`/Permissions/${item._id}`).send({ name: 'Superman' })
                expect(response.body).toHaveProperty('name', 'Superman')
            })

            it('returns a 404', async () => {
                const response = await request(app).patch(`/Permissions/${new mongoose.Types.ObjectId()}`).send({ name: 'Permissions' })
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await request(app).patch(`/Permissions/dfghjkkjhgf`).send({ name: 'Permissions' })
                expect(response.statusCode).toBe(500)
            })

        })

        describe('DELETE', () => {

            it('returns a 204', async () => {
                const response = await request(app).delete(`/Permissions/${item._id}`)
                expect(response.statusCode).toBe(204)
            })

            it('deletes the Permissions', async () => {
                await request(app).delete(`/Permissions/${item._id}`)
                const found = await Permissions.findById(item._id)
                expect(found).toBeNull()
            })

            it('tries to delete a nonexistent Permissions', async () => {
                const response = await request(app).delete(`/Permissions/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if an error occurs', async () => {
                const response = await request(app).delete(`/Permissions/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

        })

    })

})
