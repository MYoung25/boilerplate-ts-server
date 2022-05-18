import { Request } from 'express'
import { SerializedUser } from 'routes/auth/serialization'

export function createFilteredQuery (query: Record<string, unknown>, req: Request) {
    const user = (req.user as SerializedUser | undefined)
    const baseUrl = req.baseUrl.slice(1).toLowerCase()
    if (!user) return query

    return { ...query, ...user.hashFilters[baseUrl] }
}