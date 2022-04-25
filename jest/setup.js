const mongoose = require('mongoose')
const { User } = require('../src/entities/Users')
const { Roles } = require('../src/entities/Roles')
const { Permissions } = require('../src/entities/Permissions')

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

    const perm = new Permissions({ name: 'users.me.get', group: 'users' })
    await perm.save()
    const role = new Roles({ name: 'USER', permissions: [perm] })
    await role.save()
    await new User({ firstName: 'hello', lastName: 'world', email: 'hello@world.com', password: 'password', role }).save()
})

afterAll(async () => {
    await User.deleteMany({})
    await Roles.deleteMany({})
    await Permissions.deleteMany({})
    await mongoose.disconnect()
})
