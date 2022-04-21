import {IUser, User} from "../../../entities/Users"
import {VerifyFunction} from "passport-local"

export const handleUsernamePassword: VerifyFunction = async function handleUsernamePassword (email: string, password: string, done: (err: null | Error, user?: IUser) => void) {
    const user = await User.authenticate(email, password)
    if (user) {
        return done(null, user)
    }
    return done(new Error('No user with email/password combination'))
}
