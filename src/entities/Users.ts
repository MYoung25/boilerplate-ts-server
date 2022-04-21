import { Schema, Model, model, Types } from 'mongoose'
import { IRoles } from "./Roles"

export interface IUser {
    _id: Types.ObjectId,
    firstName: string
    lastName: string,
    email: string,
    profilePicture?: string,
    googleId?: string,
    role: Types.ObjectId | IRoles,
}

export const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    profilePicture: String,
    googleId: String,
    role: { type: Types.ObjectId, ref: 'Roles' }
})

userSchema.statics.findByIdWithPermissions = function findAllBySessionId (_id: Types.ObjectId): Promise<IUser> {
    return this
        .findOne({ _id })
        .populate({
            path: 'role',
            populate: { path: 'permissions' }
        })
}

export interface UserModel extends Model<IUser> {
    findByIdWithPermissions (_id: Types.ObjectId): IUser
}

export const User = model<IUser, UserModel>('User', userSchema)
