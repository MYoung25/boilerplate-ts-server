import { Response, NextFunction } from 'express'
import { IRequest } from "../../../interfaces/Express"

export const userHasPermissions = (req: IRequest, res: Response, next: NextFunction) => {
    // exit if the request is not from a logged-in user
    if (!req.isAuthenticated()) return res.sendStatus(401)
    next()
}

export default userHasPermissions
