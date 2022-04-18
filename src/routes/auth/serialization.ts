import { IUser, User } from "../../entities/User"
import { Types } from 'mongoose'

export class Serialization {

    static serialize (user: IUser, done: (error: null, id: Types.ObjectId) => { }) {
        done(null, user._id)
    }

    static async deserialize (id: Types.ObjectId, done: (err: Error | null, user: IUser | null) => { }) {
        const user = await User.findById(id.toString())
        if (user) {
            done(null, user)
            return
        }
        done(new Error('No user found'), null)
    }

}
