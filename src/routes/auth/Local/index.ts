import { Router } from 'express'
import passport from 'passport'
import { Strategy } from 'passport-local'
import {handleUsernamePassword} from "./handleUsernamePassword"

export const router = Router()

passport.use(new Strategy({
    usernameField: 'email'
}, handleUsernamePassword))

router.post('/', passport.authenticate('local'), (req, res) => {
    res.sendStatus(204)
})

export default router
