import { Response } from "express"
import { IRequest } from "../../../interfaces/Express"
import publicRoute from './publicRoute'

const req: Partial<IRequest> = {}
const res: Partial<Response> = {}
const nextMock = jest.fn()

describe('userHasPermissions', () => {

    it('calls next', () => {
        publicRoute(req as IRequest, res as Response, nextMock)
        expect(nextMock).toHaveBeenCalled()
    })

})
