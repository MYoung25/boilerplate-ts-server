import { Request, Response, NextFunction } from "express"

// this is a code readability helper function, it should not actually do anything
export const publicRoute = (req: Request, res: Response, next: NextFunction) => {
    next()
}

export default publicRoute
