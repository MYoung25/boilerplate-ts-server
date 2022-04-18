import { Schema, model, Types } from 'mongoose'

export interface IUser extends Express.User {
    _id: Types.ObjectId,
    firstName: string
    lastName: string,
    email: string,
}

export const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String
})

export const User = model<IUser>('User', userSchema)
