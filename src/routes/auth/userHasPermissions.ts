import { Response, NextFunction } from 'express'
import {IRequest} from "../../interfaces/Express"

export const userHasPermissions = (req: IRequest, res: Response, next: NextFunction) => {
    next()
}

export default userHasPermissions
