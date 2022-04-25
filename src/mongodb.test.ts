import { config } from './config/index.js'
import { getMongoDBUriString, establishMongooseConnection } from './mongodb'
import mongoose from 'mongoose'

const mockConnect = jest.spyOn(mongoose, 'connect')
// suppress any console messages
jest.spyOn(console, 'info')
    .mockImplementation(() => ({}))

describe('MongoDb',  () => {
    describe('getMongoDBUriString', () => {

        it('returns a string', () => {
            expect(typeof getMongoDBUriString()).toBe('string')
        })

        it('returns a string with a protocol', () => {
            expect(getMongoDBUriString()).toContain('mongodb://')
        })

        it('returns a string with a host', () => {
            expect(getMongoDBUriString()).toContain('mongo')
        })

        it('returns a string with a database', () => {
            expect(getMongoDBUriString()).toContain('index')
        })

        it('returns a full URI', () => {
            expect(getMongoDBUriString()).toContain(`mongodb://${process.env.MONGODB_HOST}/index`)
        })

        it ('returns a URI with username and password', () => {
            config.mongo.username = 'username'
            config.mongo.password = 'password'
            expect(getMongoDBUriString()).toContain(`mongodb://username:password@${process.env.MONGODB_HOST}/index`)
        })

    })

    describe('establishMongooseConnection', () => {

        it('calls mongoose.connect with the uri and config options', () => {
            mockConnect.mockImplementationOnce(() => Promise.resolve(mongoose))
            establishMongooseConnection()
            expect(mockConnect).toHaveBeenLastCalledWith(getMongoDBUriString(), config.mongo.options)
        })

    })
})
