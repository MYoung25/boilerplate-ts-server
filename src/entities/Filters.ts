import { Schema, model, Types } from 'mongoose'

export interface IFilters {
    _id: Types.ObjectId,
    name: string,
    filter: Record<string, any>
}

/**
 * @openapi
 * components:
 *  schemas:
 *      Filters:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              _id: 
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *              name:
 *                  type: string
 *                  example: 'Filters'
 */
export const filtersSchema = new Schema({
    name: String,
    filter: Object
})

export const Filters = model<IFilters>('Filters', filtersSchema)
