import { Request, Response, NextFunction, RequestHandler } from 'express'

export const userHasPermissions: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    // exit if the request is not from a logged-in user
    if (!req.isAuthenticated()) return res.sendStatus(401)
    next()
}

export default userHasPermissions
