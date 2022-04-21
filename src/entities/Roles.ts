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

export const Roles = model<IRoles>('Roles', rolesSchema)
