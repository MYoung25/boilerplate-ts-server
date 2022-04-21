import mongoose, { Types } from 'mongoose'
import { IUser, User } from './Users'
import { Permissions } from './Permissions'
import { Roles } from './Roles'

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

    describe('findByIdWithPermissions', () => {
        const perm = new Permissions({ name: 'permissions.get', group: 'permissions' })
        const role = new Roles({ name: 'User', permissions: [perm] })
        const user = new User({ role })

        beforeEach(async () => {
            await perm.save()
            await role.save()
            await user.save()
        })

        it('has permissions in the database', async () => {
            expect.assertions(4)
            const result = await User.findByIdWithPermissions(user._id)

            expect(result).toHaveProperty('role')
            expect(result.role).toHaveProperty('permissions')
            if (result.role && 'permissions' in result.role) {
                expect(result.role.permissions).toHaveLength(1)
                expect(result.role.permissions[0]).toEqual(expect.any(Permissions))
            }
        })
    })
})
