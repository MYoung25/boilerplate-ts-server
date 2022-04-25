import { Permissions } from './Permissions'

describe('Permissions', () => {

    it('creates a Permissions', async () => {
        expect.assertions(2)

        const entity = await new Permissions({})
            .save()
        expect(entity).toBeDefined()

        const found = await Permissions.findById(entity._id)
        expect(found).toBeDefined()
    })

    it('updates a Permissions', async () => {
        expect.assertions(2)

        const entity = await new Permissions({})
            .save()
        expect(entity).toBeDefined()

        await Permissions.updateOne({ _id: entity._id }, { name: 'updated' })
        const found = await Permissions.findById(entity._id)
        expect(found?.name).toBe('updated')
    })

    it('deletes a Permissions', async () => {
        expect.assertions(2)

        const entity = await new Permissions({})
            .save()
        expect(entity).toBeDefined()

        await Permissions.deleteOne({ _id: entity._id })
        const found = await Permissions.findById(entity._id)
        expect(found).toBeNull()
    })
})
