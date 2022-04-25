const mongoose = require('mongoose')
const { Users } = require('../src/entities/Users')
const { Roles } = require('../src/entities/Roles')
const { Permissions } = require('../src/entities/Permissions')

export const perm = new Permissions({ name: 'users.me.get', group: 'users' })
export const role = new Roles({ name: 'USER', permissions: [perm] })
export const password = 'password'
export const user = new Users({ firstName: 'hello', lastName: 'world', email: 'hello@world.com', password, role })

declare global {
    var __MONGO_URI__: string
}

beforeAll(async () => {
    const { readyState } = mongoose.connection
    // only initialize the mongoose connection if the code isn't already trying to
    if (readyState === 0 || readyState === 99) {
        await mongoose.connect(global.__MONGO_URI__)
    } else {
        // wait until the mongoose connection is ready before proceeding
        //      this is used if the code is trying to connect, ignored if the beforeAll connection is
        while (mongoose.connection.readyState !== 1) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }
    }

    await perm.save()
    await role.save()
    await user.save()
})

afterEach(async () => {
    await Users.deleteMany({ _id: { $ne: user._id } })
    await Roles.deleteMany({ _id: { $ne: role._id } })
    await Permissions.deleteMany({ _id: { $ne: perm._id } })
})

afterAll(async () => {
    await Users.deleteMany({})
    await Roles.deleteMany({})
    await Permissions.deleteMany({})
    await mongoose.disconnect()
})
