import { Router } from 'express'
import session from 'express-session'
import { createClient } from 'redis'
import connectRedis from 'connect-redis'
import { logger, config } from '../../config/index'

const RedisStore = connectRedis(session)

const redisClient = createClient({ legacyMode: true })

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


export default router