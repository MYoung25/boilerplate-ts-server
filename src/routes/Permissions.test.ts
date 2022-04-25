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

    describe('GET', () => {

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
        const name = 'PERMISSIONS'

        afterAll(async () => {
            await Permissions.deleteOne({ name })
        })

        it('returns a 201 with the new permission object', async () => {
            const response = await request(app).post('/Permissions').send({ name })
            expect(response.statusCode).toBe(201)
            expect(response.body).toHaveProperty('name', name)

            const item = await Permissions.findById(response.body._id)
            expect(item).toHaveProperty('name', name)
        })

    })

    describe('/:id', () => {
        let item: any

        beforeAll(async () => {
            item = await Permissions.findOne({ name: 'users.me.get' })
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
