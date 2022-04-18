import mongoose from 'mongoose'
import { Serialization } from './serialization'
import { User, IUser } from "../../entities/Users"
import {ErrnoException} from "../../app"
import {expectCt} from "helmet"

declare global {
    var __MONGO_URI__: string
}

describe('Serialization', () => {
    const cb = jest.fn()
    let user = new User({
        firstName: 'hello',
        lastName: 'world',
        email: 'hello@world.com'
    })
    let connection: any
    beforeAll(async () => {
        connection = await mongoose.connect(global.__MONGO_URI__ as string)
        await user.save()
    });

    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterAll(async () => {
        await connection.disconnect()
    })

    describe('serialize', () => {

        it('calls the callback', () => {
            expect.assertions(1)


            Serialization.serialize(user, cb)
            expect(cb).toHaveBeenCalled()
        })

        it('returns an objectId', () => {
            expect.assertions(2)

            Serialization.serialize(user, cb)
            expect(cb.mock.calls[0][1]).toBeInstanceOf(mongoose.Types.ObjectId)
            expect(cb.mock.calls[0][1]).toEqual(user._id)
        })

    })

    describe('deserialize', () => {

        it('calls the callback', async () => {
            expect.assertions(1)

            await Serialization.deserialize(user._id, cb)
            expect(cb).toHaveBeenCalled()
        })

        it('returns the user', async () => {
            expect.assertions(2)

            await Serialization.deserialize(user._id, cb)
            expect(cb).toHaveBeenCalledWith(null, expect.any(User))
            expect(cb.mock.calls[0][1]._id).toEqual(user._id)
        })

        it('returns an error if no user found', async () => {
            expect.assertions(1)

            await Serialization.deserialize(new mongoose.Types.ObjectId(), cb)

            expect(cb.mock.calls[0][0].message).toEqual('No user found')
        })

    })
})

