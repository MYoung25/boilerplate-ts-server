import { Filters } from './Filters'

describe('Filters', () => {

    it('creates a Filters', async () => {
        expect.assertions(3)
        
        const entity = await new Filters({ name: 'Users' })
            .save()
        expect(entity).toBeDefined()

        const found = await Filters.findById(entity._id)
        expect(found).toBeDefined()
        expect(found?.name).toEqual('users')
    })

    it('updates a Filters', async () => {
        expect.assertions(2)
        
        const entity = await new Filters({ name: 'Users' })
            .save()
        expect(entity).toBeDefined()

        await Filters.updateOne({ _id: entity._id }, { name: 'updated' })
        const found = await Filters.findById(entity._id)
        expect(found?.name).toBe('updated')
    })

    it('deletes a Filters', async () => {
        expect.assertions(2)
        
        const entity = await new Filters({ name: 'Users' })
            .save()
        expect(entity).toBeDefined()

        await Filters.deleteOne({ _id: entity._id })
        const found = await Filters.findById(entity._id)
        expect(found).toBeNull()
    })
})
