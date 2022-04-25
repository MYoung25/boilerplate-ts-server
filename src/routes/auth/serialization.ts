import { IUser, Users } from "../../entities/Users"
import { Types } from 'mongoose'
import {IPermissions} from "../../entities/Permissions"

export interface SerializedUser extends IUser {
    hashPermissions: Record<string, string>
}

export class Serialization {

    static serialize (user: IUser, done: (error: null, id: Types.ObjectId) => void) {
        done(null, user._id)
    }

    static async deserialize (id: Types.ObjectId, done: (err: Error | null, user: SerializedUser | null) => void) {
        const user = await Users.findByIdWithPermissions(id)
        if (user && 'permissions' in user.role) {
            const deserializedUser = (user as IUser) as SerializedUser
            deserializedUser.hashPermissions = {}

            user.role.permissions.forEach((permission: IPermissions): void => {
                deserializedUser.hashPermissions[permission.name] = permission.name
            })

            done(null, deserializedUser)
            return
        }
        done(new Error('No user found'), null)
    }

}
