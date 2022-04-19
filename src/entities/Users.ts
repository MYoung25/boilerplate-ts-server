import { Schema, model, Types } from 'mongoose'

export interface IUser {
    _id: Types.ObjectId,
    firstName: string
    lastName: string,
    email: string,
    profilePicture?: string,
    googleId?: string
}

export const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    profilePicture: String,
    googleId: String
})

export const User = model<IUser>('User', userSchema)
