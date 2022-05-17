import { Schema, Model, model, Types } from 'mongoose'
import {IRoles, Roles} from "./Roles"
import bcrypt from "bcryptjs"
import config from "../config"

export interface IUser {
    _id: Types.ObjectId,
    firstName: string
    lastName: string,
    email: string,
    profilePicture?: string,
    googleId?: string,
    role: Types.ObjectId | IRoles,
    password?: string
}

/**
 * @openapi
 * components:
 *  schemas:
 *      Users:
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *              - role
 *              - email
 *          properties:
 *              _id:
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *              firstName:
 *                  type: string
 *                  example: 'Clark'
 *              lastName:
 *                  type: string
 *                  example: 'Kent'
 *              email:
 *                  type: string
 *                  example: 'clark@dailyplanet.news'
 *              profilePicture:
 *                  type: string
 *                  example: 'https://google.com/test.png'
 *              role:
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *      UsersMe:
 *          description: User object returned from Users.findByIdWithPermissions
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *              - role
 *              - email
 *          properties:
 *              _id:
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *              firstName:
 *                  type: string
 *                  example: 'Clark'
 *              lastName:
 *                  type: string
 *                  example: 'Kent'
 *              email:
 *                  type: string
 *                  example: 'clark@dailyplanet.news'
 *              profilePicture:
 *                  type: string
 *                  example: 'https://google.com/test.png'
 *              role:
 *                  $ref: '#/components/schemas/RolesMe'
 */
export const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    profilePicture: String,
    googleId: String,
    role: { type: Types.ObjectId, ref: 'Roles' },
    password: String
}, { timestamps: true })

userSchema.pre('save', async function () {
    if (!this.role) {
        this.role = await Roles.findOne({ name: 'USER' })
    }
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, config.bcrypt.saltRounds)
})

export interface UserModel extends Model<IUser> {
    authenticate (email: string, password: string): Promise<IUser | false>
    findByIdWithPermissions (_id: Types.ObjectId): Promise<IUser>
}

userSchema.statics.authenticate = async function authenticate (email: string, password: string): Promise<IUser | false> {
    const user = await this.findOne({ email })
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            return user
        }
    }
    return false
}

userSchema.statics.findByIdWithPermissions = function findAllBySessionId (_id: Types.ObjectId): Promise<IUser> {
    return this
        .findOne({ _id })
        .populate({
            path: 'role',
            populate: { path: 'permissions' }
        })
}

export const Users = model<IUser, UserModel>('Users', userSchema)
