import { handleUsernamePassword } from './handleUsernamePassword'
import { User } from '../../../entities/Users'
import mongoose from 'mongoose'

declare global {
    var __MONGO_URI__: string
}

const mockDone = jest.fn()

const email = 'username'
const password = 'password'

describe('handleUsernamePassword', function () {
    const user = new User({ email, password })
    let connection: any
    beforeAll(async () => {
        connection = await mongoose.connect(global.__MONGO_URI__ as string)
        await user.save()
    });

    beforeEach(async () => {
        jest.clearAllMocks()
    })

    afterAll(async () => {
        await User.deleteMany({})
        await connection.disconnect()
    })

    it('should return a function', function () {
        expect(typeof handleUsernamePassword).toBe('function')
    })

    it('calls done with no errors if email/password match', async () => {
        await handleUsernamePassword(email, password, mockDone)
        expect(mockDone).toHaveBeenCalled()
        expect(mockDone).not.toHaveBeenCalledWith(expect.any(Error), expect.any(User))
    })

    it('calls done with an error if email doesn\'t exist', async () => {
        await handleUsernamePassword('email1', password, mockDone)
        expect(mockDone).toHaveBeenCalledWith(expect.any(Error))
    })

    it('calls done with an error if password doesn\'t match', async () => {
        await handleUsernamePassword(email, 'password1', mockDone)
        expect(mockDone).toHaveBeenCalledWith(expect.any(Error))
    })

})
