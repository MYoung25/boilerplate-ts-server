import { Router } from 'express'
import passport from 'passport'
import {Strategy, StrategyOptions} from 'passport-google-oauth20'
import { config } from '../../../config/index'
import handleOauthCallback from "./handleOauthCallback"

export const router = Router()

passport.use(new Strategy(
    {
        clientID: config.google_oauth.client_id,
        clientSecret: config.google_oauth.client_secret,
        callbackURL: "/auth/google/callback",
    },
    handleOauthCallback
))

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/callback', passport.authenticate('google'), (req, res) => {
    res.sendStatus(204)
})

export default router
