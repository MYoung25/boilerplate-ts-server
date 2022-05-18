import { IUser, Users } from "../../entities/Users"
import { Types } from 'mongoose'
import {IPermissions} from "../../entities/Permissions"
import { IFilters } from "entities/Filters"

export interface SerializedUser extends IUser {
    hashPermissions: Record<string, string>
    hashFilters: Record<string, object>
}

export class Serialization {

    static serialize (user: Express.User, done: (err: null, user: Types.ObjectId) => void) {
        done(null, (user as IUser)._id)
    }

    static async deserialize (id: Types.ObjectId, done: (err: Error | null, user: SerializedUser | null) => void) {
        const user = await Users.findByIdWithPermissionsAndFilters(id)
        if (user && user.role && 'permissions' in user.role) {
            const deserializedUser = (user as IUser) as SerializedUser
            deserializedUser.hashPermissions = {}
            deserializedUser.hashFilters = {}

            user.role.permissions.forEach((permission: IPermissions): void => {
                deserializedUser.hashPermissions[permission.name] = permission.name
            })
            user.role.filters.forEach((filter: IFilters) => {
                deserializedUser.hashFilters[filter.name] = filter.filter
            })


            done(null, deserializedUser)
            return
        }
        done(new Error('No user found'), null)
    }

}
