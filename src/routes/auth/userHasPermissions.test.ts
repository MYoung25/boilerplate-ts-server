import { Response } from 'express'
import { IRequest } from "../../interfaces/Express"
import userHasPermissions from './userHasPermissions'

const nextMock = jest.fn()
const req: Partial<IRequest> = {
    isAuthenticated: jest.fn()
        .mockImplementation(() => false)
}
const res: Partial<Response> = {}

describe('userHasPermissions', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('calls next', () => {
        userHasPermissions(req as IRequest, res as Response, nextMock)
        expect(nextMock).toHaveBeenCalled()
    })

})
