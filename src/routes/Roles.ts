import { logger } from '../config/index'
import { Router, Response, Request } from 'express'
import { Roles } from '../entities/Roles'

const router = Router()

router.route('/')
    .get(async (req: Request, res: Response) => {
        const items = await Roles.find({})
        res.json(items)
    })
    .post(async (req: Request, res: Response) => {
        const item = new Roles(req.body)
        await item.save()
        res.status(201).json(item)
    })

router.route('/:id')
    .get(async (req: Request, res: Response) => {
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
    .patch(async (req: Request, res: Response) => {
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
    .delete(async (req: Request, res: Response) => {
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
