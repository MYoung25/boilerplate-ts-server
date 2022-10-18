const mongoose = require('mongoose')
import { HydratedDocument } from 'mongoose'
import { IFilters } from '../src/entities/Filters'
import { IPermissions } from '../src/entities/Permissions'
import { IRoles } from '../src/entities/Roles'
import { collectPermissions } from '../utils/permissions/collectPermissions'
const { Filters } = require('../src/entities/Filters')
const { Users } = require('../src/entities/Users')
const { Roles } = require('../src/entities/Roles')
const { Permissions } = require('../src/entities/Permissions')

export const filter: IFilters = { _id: mongoose.Types.ObjectId(), name: 'user', filter: { firstName: 'hello' } }
export const role: IRoles = { _id: mongoose.Types.ObjectId(), name: 'USER', permissions: [], filters: [filter] }
export const password = 'password'
export const user = { _id: mongoose.Types.ObjectId(), firstName: 'hello', lastName: 'world', email: 'hello@world.com', password, role }
export const superadminRole: IRoles = { _id: mongoose.Types.ObjectId(), name: 'SUPERADMIN', permissions: [], filters: [] }
export const superadminPassword = 'password'
export const superadmin = { _id: mongoose.Types.ObjectId(), firstName: 'super', lastName: 'admin', email: 'super@admin.com', password: superadminPassword, role: superadminRole }

declare global {
    var __MONGO_URI__: string
}

export let perm: IPermissions
export let allPermissions: HydratedDocument<IPermissions>[] = []

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

    allPermissions = await collectPermissions()
})

beforeEach(async () => {
	await new Filters(filter).save()
    await Promise.all(allPermissions.map(permission => new Permissions(permission).save()))

    // default user should have 
    perm = await Permissions.findOne({ name: 'users.me.get' })
    role.permissions = [perm]
    await Roles(role).save()
    await Users(user).save()

    
    // create a superadmin with all permissions
    superadminRole.permissions = allPermissions
    await new Roles(superadminRole).save()
    await new Users(superadmin).save()
})

afterEach(async () => {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(global.__MONGO_URI__)
    }
	await Filters.deleteMany({})
    await Users.deleteMany({})
    await Roles.deleteMany({})
    await Permissions.deleteMany({})
})

afterAll(async () => {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(global.__MONGO_URI__)
    }
    await Users.deleteMany({})
    await Roles.deleteMany({})
    await Permissions.deleteMany({})
	await Filters.deleteMany({})
    await mongoose.disconnect()
})
