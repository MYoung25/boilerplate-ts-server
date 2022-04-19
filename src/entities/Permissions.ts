import { Schema, model, Types } from 'mongoose'

export interface IPermissions {
    _id: Types.ObjectId,
    name: string,
    group: string,
}

export const permissionsSchema = new Schema({
    name: String,
    group: String
})

export const Permissions = model<IPermissions>('Permissions', permissionsSchema)
