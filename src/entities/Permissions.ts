import { Schema, model, Types } from 'mongoose'

export interface IPermissions {
    _id: Types.ObjectId,
    name: string
}

export const permissionsSchema = new Schema({
    name: String
})

export const Permissions = model<IPermissions>('Permissions', permissionsSchema)
