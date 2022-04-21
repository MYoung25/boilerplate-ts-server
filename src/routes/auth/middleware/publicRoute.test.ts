import { Request, Response } from "express"
import publicRoute from './publicRoute'

const req: Partial<Request> = {}
const res: Partial<Response> = {}
const nextMock = jest.fn()

describe('userHasPermissions', () => {

    it('calls next', () => {
        publicRoute(req as Request, res as Response, nextMock)
        expect(nextMock).toHaveBeenCalled()
    })

})
