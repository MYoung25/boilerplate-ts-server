import { IUser, Users } from './Users'
import { Permissions } from './Permissions'
import { Roles } from './Roles'

declare global {
    var __MONGO_URI__: string
}

describe('User', () => {
    let userRole: any
    beforeAll(async () => {
        userRole = await Roles.findOne({ name: 'USER' })
    });

    it('creates a User', async () => {
        expect.assertions(2)

        const entity = new Users({})
        await entity.save()

        const found = await Users.findById(entity._id)
        expect(found).toBeDefined()
        expect(found).toHaveProperty('role', userRole._id)
    })

    it('saves the password as a hashed value', async () => {
        expect.assertions(1)
        const password = 'password'
        const entity = new Users({ password })
        await entity.save()
        const found = await Users.findById(entity._id)
        expect(found).toHaveProperty('password', expect.not.stringContaining(password))
    })

    it('saves the updated password as a hashed value', async () => {
        expect.assertions(2)
        const password = 'password'
        const entity = new Users({ password })
        await entity.save()
        const found = await Users.findById(entity._id)
        expect(found).toHaveProperty('password', expect.not.stringContaining(password))

        entity.password = 'password2'
        await entity.save()

        const found2 = await Users.findById(entity._id)
        expect(found2).toHaveProperty('password', expect.not.stringContaining(found?.password || ''))
    })

    it('updates a User', async () => {
        expect.assertions(2)

        const entity = await new Users({})
            .save()
        expect(entity).toBeDefined()

        await Users.updateOne({ _id: entity._id }, { firstName: 'updated' })
        const found = await Users.findById(entity._id)
        expect(found?.firstName).toBe('updated')
    })

    it('deletes a User', async () => {
        expect.assertions(2)

        const entity = await new Users({})
            .save()
        expect(entity).toBeDefined()

        await Users.deleteOne({ _id: entity._id })
        const found = await Users.findById(entity._id)
        expect(found).toBeNull()
    })

    describe('findByIdWithPermissions', () => {
        const perm = new Permissions({ name: 'permissions.get', group: 'permissions' })
        const role = new Roles({ name: 'User', permissions: [perm] })
        const user = new Users({ role })

        beforeEach(async () => {
            await perm.save()
            await role.save()
            await user.save()
        })

        it('has permissions in the database', async () => {
            expect.assertions(4)
            const result = await Users.findByIdWithPermissions(user._id)

            expect(result).toHaveProperty('role')
            expect(result.role).toHaveProperty('permissions')
            if (result.role && 'permissions' in result.role) {
                expect(result.role.permissions).toHaveLength(1)
                expect(result.role.permissions[0]).toEqual(expect.any(Permissions))
            }
        })
    })

    describe('comparePassword', () => {
        let _id: any
        const email = 'hello@world.com'
        const password = 'password'
        beforeAll(async () => {
            const entity = await Users.findOne({ email })
            if (entity) {
                _id = entity._id
            }
        })

        it('returns User if the passwords match', async () => {
            const result = await Users.authenticate(email, password)
            expect(result).toEqual(expect.any(Users))
            expect(result).toHaveProperty('_id', _id)
        })

        it('returns false if the passwords don\'t match', async () => {
            const result = await Users.authenticate(email, 'password1')
            expect(result).toEqual(false)
        })

        it('returns false if there is no user with that email', async () => {
            const result = await Users.authenticate('email1', password)
            expect(result).toEqual(false)
        })

    })
})
