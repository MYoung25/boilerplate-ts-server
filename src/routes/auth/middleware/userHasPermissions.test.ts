import { Request, Response } from 'express'
import userHasPermissions from './userHasPermissions'

const nextMock = jest.fn()
const isAuthenticated = jest.fn()
    .mockImplementation(() => false)

const req: Partial<Request> = {
    isAuthenticated
}
const res: Partial<Response> = {
    sendStatus: jest.fn()
}

describe('userHasPermissions', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('sends a 401 if unauthenticated', () => {
        userHasPermissions(req as Request, res as Response, nextMock)
        expect(res.sendStatus).toHaveBeenCalledWith(401)
    })

    it('calls next if authenticated', () => {
        isAuthenticated.mockImplementationOnce(() => true)
        userHasPermissions(req as Request, res as Response, nextMock)
        expect(nextMock).toHaveBeenCalled()
    })

})
