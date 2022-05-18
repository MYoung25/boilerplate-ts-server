import { Request } from 'express'
import { createFilteredQuery } from './createFilteredQuery'
import { user, perm, filter } from '../../../jest/setup'
import { Serialization, SerializedUser } from '../../routes/auth/serialization'

describe('createFilteredQuery', () => {
    let userReq: Partial<Request>
    let reqBase: Record<string, unknown>
    beforeAll(async () => {
        reqBase = {
            baseUrl: '/Permissions',
            route: {
                path: `/${perm._id}`
            },
            method: 'get',
        }
        await Serialization.deserialize(user._id, (err, serializedUser) => {
            if (serializedUser) {
                userReq = {
                    user: serializedUser as SerializedUser,
                    ...reqBase
                }
            } else {
                throw new Error('Test broke, user not serialized')
            }
        })
    })

    it('returns an object', () => {
        expect(typeof createFilteredQuery({}, userReq as Request)).toBe('object')
    })

    it('returns the same object if no user is present', () => {
        const query = { name: 'Superman' }
        expect(createFilteredQuery(query, reqBase as Partial<Request> as Request)).toBe(query)
    })

    it('returns the same object if no filter is present on the user', () => {
        const query = { name: 'Superman' }
        expect(JSON.stringify(createFilteredQuery(query, userReq as Request))).toBe(JSON.stringify(query))
    })

    it('merges a query with a filter', () => {
        const query = { name: 'Superman' }
        userReq.user as SerializedUser
        const returnedQuery = createFilteredQuery(query, ({...userReq, baseUrl: `/${filter.name}` }) as Request)

        const filterKey = Object.keys(filter.filter)[0]

        expect(returnedQuery).toHaveProperty('name', query.name)
        expect(returnedQuery).toHaveProperty(filterKey, filter.filter[filterKey])
    })

})