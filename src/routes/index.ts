import express, { Request, Response } from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import {setupPassport} from "./auth"
import Permissions from './Permissions'
import User from './Users'
import auth from './auth'

export const app = express()

app.use(helmet())

app.get('/ping', (req: Request, res: Response) => {
  const { readyState } = mongoose.connection
  let status = 503
  if (readyState) {
    status = 200
  }
  res.sendStatus(status)
})

app.use(express.json())
setupPassport(app)

app.use('/permissions', Permissions)
app.use('/users', User)
app.use('/auth', auth)
