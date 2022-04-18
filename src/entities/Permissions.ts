import { Schema, model } from 'mongoose'

export interface IPermissions {
    name: string
}

export const permissionsSchema = new Schema({
    name: String
})

export const Permissions = model<IPermissions>('Permissions', permissionsSchema)
