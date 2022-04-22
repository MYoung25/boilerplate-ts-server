import { Request, Response } from 'express'
import userHasPermissions from './userHasPermissions'
import { User } from "../../../entities/Users"
import mongoose from 'mongoose'
import { Serialization } from "../serialization"
import {Permissions} from "../../../entities/Permissions"
import {Roles} from "../../../entities/Roles"

declare global {
    var __MONGO_URI__: string
}


const nextMock = jest.fn()
const isAuthenticated = jest.fn()
    .mockImplementation(() => false)

const req: Partial<Request> = {
    baseUrl: '/users',
    route: {
        path: '/me'
    },
    method: 'get',
    user: new User({}),
    isAuthenticated
}
const res: Partial<Response> = {
    sendStatus: jest.fn()
}

describe('userHasPermissions', () => {
    const perm = new Permissions({ name: 'users.me.get', group: 'users' })
    const role = new Roles({ name: 'User', permissions: [perm] })
    let user = new User({
        firstName: 'hello',
        lastName: 'world',
        email: 'hello@world.com',
        role
    })
    let connection: any

    beforeAll(async () => {
        connection = await mongoose.connect(global.__MONGO_URI__ as string)
        await perm.save()
        await role.save()
        await user.save()
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterAll(async () => {
        await perm.delete()
        await role.delete()
        await user.delete()
        await connection.disconnect()
    })

    it('sends a 401 if unauthenticated', () => {
        userHasPermissions(req as Request, res as Response, nextMock)
        expect(res.sendStatus).toHaveBeenCalledWith(401)
    })

    it('sends 401 if user has no permissions', () => {
        userHasPermissions({...req, user: new User({})} as Request, res as Response, nextMock)
        expect(res.sendStatus).toHaveBeenCalledWith(401)
    })

    it('calls next if user has permissions', async () => {
        expect.assertions(1)
        isAuthenticated.mockImplementationOnce(() => true)
        await Serialization.deserialize(user._id, (err, serializedUser) => {
            userHasPermissions({...req, user: serializedUser } as Request, res as Response, nextMock)
            expect(nextMock).toHaveBeenCalled()
        })
    })

})
