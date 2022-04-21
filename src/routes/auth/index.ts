import { Express, Router } from 'express'
import passport from 'passport'
import session from 'express-session'
import { createClient } from 'redis'
import connectRedis from 'connect-redis'
import { logger, config } from '../../config'
import { Serialization } from "./serialization"

import Google from './Google/index'
import Local from './Local/index'

export const router = Router()

export function setupPassport (app: Express) {
	const RedisStore = connectRedis(session)

	const redisClient = createClient({
		url: config.redis.url,
		legacyMode: true
	})

	/* istanbul ignore else */
	if (config.node_env === 'test') {
		app.use(
			session({
				saveUninitialized: false,
				secret: config.redis.secret,
				resave: false
			})
		)
	} else {
		redisClient.connect().catch(logger.error)
		redisClient.on('error', logger.error)

		app.use(
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

	app.use(passport.initialize())
	app.use(passport.session())
}

router.use('/login', Local)
router.use('/google', Google)

export default router
