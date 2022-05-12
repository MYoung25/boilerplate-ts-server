import request from 'supertest'
import mongoose from 'mongoose'
import { app } from './index'
import { Users } from '../entities/Users'
import { user, password } from '../../jest/setup'

// suppress error messages
jest.spyOn(console, 'error')
    .mockImplementation(() => ({}))

describe('/api/Users', () => {

    describe('GET', () => {

        beforeAll(async () => {
            await new Users({}).save()
        })

        it('returns a 200', async () => {
            const response = await request(app).get('/Users')
            expect(response.statusCode).toBe(200)
        })

        it('returns all Users', async() => {
            const response = await request(app).get('/Users')
            const users = await Users.find({})
            expect(response.body.length).toBe(users.length)
        })

    })

    describe('POST', () => {
        const firstName = 'User'
        afterEach(async () => {
            await Users.deleteMany({ firstName })
        })

        it('returns a 201', async () => {
            const response = await request(app).post('/Users').send({ firstName })
            expect(response.statusCode).toBe(201)
        })

        it('returns the new User', async () => {
            const response = await request(app).post('/Users').send({ firstName })
            expect(response.body).toHaveProperty('firstName', 'User')
        })

        it('inserts the new User', async () => {
            const response = await request(app).post('/Users').send({ firstName })
            const item = await Users.findById(response.body._id)
            expect(item).toHaveProperty('firstName', 'User')
        })

    })

    describe('/me', () => {

        describe('GET', () => {

            it('returns 401 for unauthenticated request', async () => {
                const response = await request(app).get('/Users/me')
                expect(response.statusCode).toBe(401)
            })

            it('returns 200 and the user for an authenticated user', async () => {
                const agent = await request.agent(app)
                await agent.post('/auth/login')
                    .send({ email: user.email, password: password })
                const response = await agent.get('/users/me')
                expect(response.status).toEqual(200)
                expect(response.body).toHaveProperty('role')
                expect(response.body.role).toHaveProperty('permissions')
                expect(response.body.role.permissions[0]).toEqual(expect.objectContaining({
                    _id: expect.anything(), // ObjectId, we don't care about type
                    __v: expect.anything(),
                    name: expect.any(String),
                    group: expect.any(String)
                }))
            })

        })

    })

    describe('/:id', () => {

        describe('GET', () => {

            it('returns a 200', async () => {
                const response = await request(app).get(`/Users/${user._id}`)
                expect(response.statusCode).toBe(200)
            })

            it('returns the User', async () => {
                const response = await request(app).get(`/Users/${user._id}`)
                expect(response.body).toHaveProperty('_id', expect.any(String))
                expect(response.body).toHaveProperty('__v', 0)
            })

            it('returns a 404', async () => {
                const response = await request(app).get(`/Users/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await request(app).get(`/Users/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

        })

        describe('PATCH', () => {

            it('returns a 200', async () => {
                const response = await request(app).patch(`/Users/${user._id}`).send({ firstName: 'User' })
                expect(response.statusCode).toBe(200)
            })

            it('returns the updated User', async () => {
                const response = await request(app).patch(`/Users/${user._id}`).send({ firstName: 'Superman' })
                expect(response.body).toHaveProperty('firstName', 'Superman')
            })

            it('returns a 404', async () => {
                const response = await request(app).patch(`/Users/${new mongoose.Types.ObjectId()}`).send({ name: 'User' })
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await request(app).patch(`/Users/dfghjkkjhgf`).send({ name: 'User' })
                expect(response.statusCode).toBe(500)
            })

        })

        describe('DELETE', () => {

            it('returns a 204', async () => {
                const response = await request(app).delete(`/Users/${user._id}`)
                expect(response.statusCode).toBe(204)
            })

            it('deletes the User', async () => {
                await request(app).delete(`/Users/${user._id}`)
                const found = await Users.findById(user._id)
                expect(found).toBeNull()
            })

            it('tries to delete a nonexistent User', async () => {
                const response = await request(app).delete(`/Users/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if an error occurs', async () => {
                const response = await request(app).delete(`/Users/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

        })

    })

})
