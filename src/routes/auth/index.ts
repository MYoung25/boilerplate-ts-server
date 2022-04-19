import { Router } from 'express'
import passport from 'passport'
import session from 'express-session'
import { createClient } from 'redis'
import connectRedis from 'connect-redis'
import { logger, config } from '../../config'
import { Serialization } from "./serialization"

import Google from './Google/index'

const RedisStore = connectRedis(session)

const redisClient = createClient({
	url: config.redis.url,
	legacyMode: true
})

export const router = Router()

/* istanbul ignore else */
if (config.node_env === 'test') {
	router.use(
		session({
			saveUninitialized: false,
			secret: config.redis.secret,
			resave: false
		})
	)
} else {
	redisClient.connect().catch(logger.error)

	router.use(
		session({
			store: new RedisStore({ client: redisClient }),
			saveUninitialized: false,
			secret: config.redis.secret,
			resave: false
		})
	)
}


// passport.(de)serializeUser implements an invalid User definition,
// 	ts-ignore the calls and use our IUser definition instead in Serialization
// @ts-ignore
passport.serializeUser(Serialization.serialize)
// @ts-ignore
passport.deserializeUser(Serialization.deserialize)

router.use(passport.initialize())

router.use('/google', Google)

export default router
