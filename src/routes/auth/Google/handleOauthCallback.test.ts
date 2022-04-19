import handleOauthCallback from "./handleOauthCallback"
import mongoose from 'mongoose'
import { User } from '../../../entities/Users'
import { Profile } from 'passport-google-oauth20'

declare global {
    var __MONGO_URI__: string
}

describe('Google/handleOauthCallback', function () {
    const mockCallback = jest.fn()
    const profile: Profile = {
        displayName: 'Google User',
        profileUrl: 'https://google.com',
        id: '0976543fghj',
        _raw: '',
        provider: 'google',
        _json: {
            iss: 'string',
            aud: 'string',
            sub: 'string',
            iat: 67812,
            exp: 68999,
        }
    }
    let connection: any
    beforeAll(async () => {
        connection = await mongoose.connect(global.__MONGO_URI__ as string)
    });

    beforeEach(async () => {
        await User.deleteMany({})
        jest.clearAllMocks()
    })

    afterAll(async () => {
        await connection.disconnect()
    })

    it('calls callback', async () => {
        await handleOauthCallback('access', 'refresh', profile, mockCallback)

        expect(mockCallback).toHaveBeenCalled()
    })

    it('inserts a user if they don\'t already exist', async () => {
        await handleOauthCallback('access', 'refresh', profile, mockCallback)

        const foundUser = await User.findOne({ googleId: profile.id })

        expect(foundUser).not.toBeNull()
        expect(foundUser?.googleId).toEqual(profile.id)
        expect(mockCallback).toHaveBeenCalledWith(null, foundUser)
    })

    it('calls callback with an error if input is wrong', async () => {
        await handleOauthCallback('access', 'refresh', {...profile, id: {}} as unknown as Profile, mockCallback)

        expect(mockCallback).toHaveBeenCalledWith(expect.any(Error))
    })

})
