import mongoose from 'mongoose'
import { IUser, User } from './Users'

declare global {
    var __MONGO_URI__: string
}

describe('User', () => {
    let connection: any
    beforeAll(async () => {
        connection = await mongoose.connect(global.__MONGO_URI__ as string)
    });

    beforeEach(async () => {
        await User.deleteMany({})
    })

    afterAll(async () => {
        await connection.disconnect()
    })

    it('creates a User', async () => {
        expect.assertions(2)

        const entity = await new User({})
            .save()
        expect(entity).toBeDefined()

        const found = await User.findById(entity._id)
        expect(found).toBeDefined()
    })

    it('updates a User', async () => {
        expect.assertions(2)

        const entity = await new User({})
            .save()
        expect(entity).toBeDefined()

        await User.updateOne({ _id: entity._id }, { firstName: 'updated' })
        const found = await User.findById(entity._id)
        expect(found?.firstName).toBe('updated')
    })

    it('deletes a User', async () => {
        expect.assertions(2)

        const entity = await new User({})
            .save()
        expect(entity).toBeDefined()

        await User.deleteOne({ _id: entity._id })
        const found = await User.findById(entity._id)
        expect(found).toBeNull()
    })
})
