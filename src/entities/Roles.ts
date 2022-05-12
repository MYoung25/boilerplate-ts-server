import { Schema, model, Types } from 'mongoose'
import { IPermissions } from "./Permissions"

export interface IRoles {
    _id: Types.ObjectId,
    name: string,
    permissions:  IPermissions[]
}

/**
 * @openapi
 * components:
 *  schemas:
 *      Roles:
 *          type: object
 *          required:
 *              - name
 *              - permissions
 *          properties:
 *              _id: 
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *              name:
 *                  type: string
 *                  example: 'permissions.get'
 *              permissions: 
 *                  type: array
 *                  items: 
 *                      type: string
 *                      example: '627afea4acf098768c92b855'
 *      RolesMe:
 *          description: Role object returned from Users.findByIdWithPermissions
 *          type: object
 *          required:
 *              - name
 *              - permissions
 *          properties:
 *              _id: 
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *              name:
 *                  type: string
 *                  example: 'permissions.get'
 *              permissions: 
 *                  type: array
 *                  items: 
 *                      $ref: '#/components/schemas/Permissions'
 */
export const rolesSchema = new Schema({
    name: String,
    permissions: [{ type: Types.ObjectId, ref: 'Permissions'} ]
})

rolesSchema.pre('save', function () {
    if (!this.isModified('name')) return
    this.name = this.name.toUpperCase()
})

export const Roles = model<IRoles>('Roles', rolesSchema)
