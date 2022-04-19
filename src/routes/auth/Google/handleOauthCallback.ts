import { User } from "../../../entities/Users"
import { Profile, VerifyCallback } from 'passport-google-oauth20'

// {
//     id: '100...909',
//         displayName: 'Michael Young',
//     name: { familyName: 'Young', givenName: 'Michael' },
//     emails: [ { value: 'technology@givebackcincinnati.org', verified: true } ],
//         photos: [
//     {
//         value: 'https://lh3.googleusercontent.com/a-/AOh14Ggik_XwQp40Jb1kdUY5A-rTWc2u-oWmpBLog1s5=s96-c'
//     }
// ],
//     provider: 'google',
//     _raw: '{\n' +
// '  "sub": "1002...0909",\n' +
// '  "name": "Michael Young",\n' +
// '  "given_name": "Michael",\n' +
// '  "family_name": "Young",\n' +
// '  "picture": "https://lh3.googleusercontent.com/a-/AOh14Ggik_XwQp40Jb1kdUY5A-rTWc2u-oWmpBLog1s5\\u003ds96-c",\n' +
// '  "email": "technology@givebackcincinnati.org",\n' +
// '  "email_verified": true,\n' +
// '  "locale": "en",\n' +
// '  "hd": "givebackcincinnati.org"\n' +
// '}',
//     _json: {
//     sub: '1002...909',
//         name: 'Michael Young',
//         given_name: 'Michael',
//         family_name: 'Young',
//         picture: 'https://lh3.googleusercontent.com/a-/AOh14Ggik_XwQp40Jb1kdUY5A-rTWc2u-oWmpBLog1s5=s96-c',
//         email: 'technology@givebackcincinnati.org',
//         email_verified: true,
//         locale: 'en',
//         hd: 'givebackcincinnati.org'
// }
// }

export default async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
) => {
    try {
        const user = await User.findOneAndUpdate({ googleId: profile.id }, {
            googleId: profile.id,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            email: profile._json.email,
            profilePicture: profile._json.picture
        }, {
            upsert: true,
            returnDocument: 'after'
        })
        done(null, user)
    } catch (e: any) {
        done(e)
    }
}
