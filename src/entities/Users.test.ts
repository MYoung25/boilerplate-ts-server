import mongoose from 'mongoose'
import { IUser, User } from './Users'
import { Permissions } from './Permissions'
import { Roles } from './Roles'

declare global {
    var __MONGO_URI__: string
}

describe('User', () => {
    let connection: any
    let userRole = new Roles({
        name: 'USER'
    })
    beforeAll(async () => {
        connection = await mongoose.connect(global.__MONGO_URI__ as string)
        await userRole.save()
    });

    afterEach(async () => {
        await User.deleteMany({})
        await Permissions.deleteMany({})
    })

    afterAll(async () => {
        await connection.disconnect()
    })

    it('creates a User', async () => {
        expect.assertions(3)

        const entity = await new User({})
            .save()
        expect(entity).toBeDefined()

        const found = await User.findById(entity._id)
        expect(found).toBeDefined()
        expect(found).toHaveProperty('role', userRole._id)
    })

    it('saves the password as a hashed value', async () => {
        expect.assertions(1)
        const password = 'password'
        const entity = new User({ password })
        await entity.save()
        const found = await User.findById(entity._id)
        expect(found).toHaveProperty('password', expect.not.stringContaining(password))
    })

    it('saves the updated password as a hashed value', async () => {
        expect.assertions(2)
        const password = 'password'
        const entity = new User({ password })
        await entity.save()
        const found = await User.findById(entity._id)
        expect(found).toHaveProperty('password', expect.not.stringContaining(password))

        entity.password = 'password2'
        await entity.save()

        const found2 = await User.findById(entity._id)
        expect(found2).toHaveProperty('password', expect.not.stringContaining(found?.password || ''))
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

    describe('comparePassword', () => {
        const _id = new mongoose.Types.ObjectId()
        const email = 'email'
        const password = 'password'
        beforeEach(async () => {
            const entity = new User({ _id, email, password })
            await entity.save()
        })

        it('returns User if the passwords match', async () => {
            const result = await User.authenticate(email, password)
            expect(result).toEqual(expect.any(User))
            expect(result).toHaveProperty('_id', _id)
        })

        it('returns false if the passwords don\'t match', async () => {
            const result = await User.authenticate(email, 'password1')
            expect(result).toEqual(false)
        })

        it('returns false if there is no user with that email', async () => {
            const result = await User.authenticate('email1', password)
            expect(result).toEqual(false)
        })

    })
})
