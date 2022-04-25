import { Roles } from './Roles'

describe('Roles', () => {

    it('creates a Roles', async () => {
        expect.assertions(2)

        const entity = await new Roles({})
            .save()
        expect(entity).toBeDefined()

        const found = await Roles.findById(entity._id)
        expect(found).toBeDefined()
    })

    it('saves the name in uppercase', async () => {
        expect.assertions(1)
        const name = 'admin'
        const entity = new Roles({ name })
        await entity.save()

        const found = await Roles.findById(entity._id)
        expect(found).toHaveProperty('name', name.toUpperCase())
    })

    it('updates a Roles', async () => {
        expect.assertions(2)

        const entity = await new Roles({})
            .save()
        expect(entity).toBeDefined()

        await Roles.updateOne({ _id: entity._id }, { name: 'updated' })
        const found = await Roles.findById(entity._id)
        expect(found?.name).toBe('updated')
    })

    it('deletes a Roles', async () => {
        expect.assertions(2)

        const entity = await new Roles({})
            .save()
        expect(entity).toBeDefined()

        await Roles.deleteOne({ _id: entity._id })
        const found = await Roles.findById(entity._id)
        expect(found).toBeNull()
    })
})
