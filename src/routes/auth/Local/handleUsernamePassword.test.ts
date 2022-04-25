import { handleUsernamePassword } from './handleUsernamePassword'
import { Users } from '../../../entities/Users'
import { user, password } from "../../../../jest/setup"

const mockDone = jest.fn()

describe('handleUsernamePassword', function () {

    beforeEach(async () => {
        jest.clearAllMocks()
    })

    it('should return a function', function () {
        expect(typeof handleUsernamePassword).toBe('function')
    })

    it('calls done with no errors if email/password match', async () => {
        await handleUsernamePassword(user.email, password, mockDone)
        expect(mockDone).toHaveBeenCalled()
        expect(mockDone).not.toHaveBeenCalledWith(expect.any(Error), expect.any(Users))
    })

    it('calls done with an error if email doesn\'t exist', async () => {
        await handleUsernamePassword('email1', password, mockDone)
        expect(mockDone).toHaveBeenCalledWith(expect.any(Error))
    })

    it('calls done with an error if password doesn\'t match', async () => {
        await handleUsernamePassword(user.email, 'password1', mockDone)
        expect(mockDone).toHaveBeenCalledWith(expect.any(Error))
    })

})
