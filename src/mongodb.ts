import mongoose from 'mongoose'
import { config } from './config/index'

export function getMongoDBUriString () {
  if (config.mongo.username && config.mongo.password) {
    return `${config.mongo.protocol}://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}/${config.mongo.database}`
  }
  const uri = `${config.mongo.protocol}://${config.mongo.host}/${config.mongo.database}`
  return uri
}

export function establishMongooseConnection () {
    return mongoose.connect(getMongoDBUriString(), config.mongo.options as Record<string, unknown>)
}
