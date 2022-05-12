import { logger } from '../config/index'
import { Router, Response, Request } from 'express'
import { Roles } from '../entities/Roles'
import { userHasPermissions } from "./auth/middleware"

/**
 * @openapi
 * tags: 
 *  - name: roles
 *    description: Roles to assign users
 */
const router = Router()
/**
 * @openapi
 * /roles:
 *  get:
 *    tags:
 *      - roles
 *    operationId: searchRoles
 *    summary: Search roles records
 *    description: Get roles records
 *    responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Roles'
 *  post:
 *    tags:
 *      - roles
 *    operationId: createRole
 *    summary: Create a roles record
 *    description: Create a new roles record
 *    requestBody:
 *      content:
 *          application/json:
 *              schema: 
 *                  $ref: '#/components/schemas/Roles'
 *    responses:
 *      201:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Roles'
 */
router.route('/')
    .get(userHasPermissions('public'), async (req: Request, res: Response) => {
        const items = await Roles.find({})
        res.json(items)
    })
    .post(userHasPermissions('public'), async (req: Request, res: Response) => {
        const item = new Roles(req.body)
        await item.save()
        res.status(201).json(item)
    })

/**
 * @openapi
 * /roles/{id}:
 *  parameters:
 *      - in: path
 *        name: id
 *  get:
 *      tags:
 *          - roles
 *      operationId: getRole
 *      summary: Get a single roles record
 *      description: Get a single roles record
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Roles'
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred
 *  patch:
 *      tags:
 *          - roles
 *      operationId: updateRole
 *      summary: Update a single roles record
 *      description: Update a single roles record
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Roles'
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred 
 *  delete:
 *      tags:
 *          - roles
 *      operationId: deleteRole
 *      summary: Delete a roles record
 *      description: Delete a roles record
 *      responses:
 *          204:
 *              description: Success
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred
 */
router.route('/:id')
    .get(userHasPermissions('public'), async (req: Request, res: Response) => {
        try {
            const item = await Roles.findOne({ _id: req.params.id })
            if (item) {
                res.json(item)
                return
            }
            res.sendStatus(404)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })
    .patch(userHasPermissions('public'), async (req: Request, res: Response) => {
        try {
            const item = await Roles.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            if (item) {
                res.json(item)
                return
            }
            res.sendStatus(404)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })
    .delete(userHasPermissions('public'), async (req: Request, res: Response) => {
        try {
            const item = await Roles.deleteOne({ _id: req.params.id })
            if (item.deletedCount === 1) {
                res.sendStatus(204)
                return
            }
            res.sendStatus(404)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })

export default router
