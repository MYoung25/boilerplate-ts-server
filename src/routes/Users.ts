import { logger } from '../config/index'
import { Router, Response, Request } from 'express'
import { User } from '../entities/Users'
import { userHasPermissions } from './auth/middleware'

const router = Router()

router.route('/')
    .get(async (req: Request, res: Response) => {
        const items = await User.find({})
        res.json(items)
    })
    .post(async (req: Request, res: Response) => {
        const item = new User(req.body)
        await item.save()
        res.status(201).json(item)
    })

router.route('/me')
    .get(userHasPermissions, (req, res) => {
        res.sendStatus(401)
    })

router.route('/:id')
    .get(async (req: Request, res: Response) => {
        try {
            const item = await User.findOne({ _id: req.params.id })
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
            const item = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
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
            const item = await User.deleteOne({ _id: req.params.id })
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
