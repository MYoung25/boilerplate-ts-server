import { Schema, model, Types } from 'mongoose'
import { IPermissions } from "./Permissions"

export interface IRoles {
    _id: Types.ObjectId,
    name: string,
    permissions:  IPermissions[]
}

export const rolesSchema = new Schema({
    name: String,
    permissions: [{ type: Types.ObjectId, ref: 'Permissions'} ]
})

rolesSchema.pre('save', function () {
    if (!this.isModified('name')) return
    this.name = this.name.toUpperCase()
})

export const Roles = model<IRoles>('Roles', rolesSchema)
