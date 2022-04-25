import { Request, Response } from 'express'
import userHasPermissions from './userHasPermissions'
import { Users } from "../../../entities/Users"
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
    user: new Users({}),
    isAuthenticated
}
const res: Partial<Response> = {
    sendStatus: jest.fn()
}

describe('userHasPermissions', () => {
    let perm: any
    let role: any
    let user: any

    beforeAll(async () => {
        perm = await Permissions.findOne({ name: 'users.me.get' })
        role = await Roles.findOne({ name: 'USER' })
        user = await Users.findOne({ firstName: 'hello' })
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('sends a 401 if unauthenticated', () => {
        userHasPermissions(req as Request, res as Response, nextMock)
        expect(res.sendStatus).toHaveBeenCalledWith(401)
    })

    it('sends 401 if user has no permissions', () => {
        userHasPermissions({...req, user: new Users({})} as Request, res as Response, nextMock)
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
