import { Request, Response, NextFunction, RequestHandler } from 'express'
import {SerializedUser} from "../serialization"

export const userHasPermissions: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    // exit if the request is not from a logged-in user
    if (!req.isAuthenticated()) return res.sendStatus(401)
    const baseUrl = req.baseUrl.slice(1).toLowerCase()
    const path = req.route.path.slice(1).replace(':', '').toLowerCase()
    const method = req.method.toLowerCase()

    const permission = `${baseUrl}.${path ? path + '.' : ''}${method}`

    const user = (req.user as SerializedUser)
    if (user.role && 'permissions' in user.role) {
        const hasPermission = user.hashPermissions[permission]
        if (hasPermission) {
            return next()
        }
    }
    res.sendStatus(401)
}

export default userHasPermissions
