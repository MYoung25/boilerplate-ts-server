import { Response, NextFunction } from "express"
import { IRequest } from "../../../interfaces/Express"

// this is a code readability helper function, it should not actually do anything
export const publicRoute = (req: IRequest, res: Response, next: NextFunction) => {
    next()
}

export default publicRoute
