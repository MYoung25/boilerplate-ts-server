import express, { Request, Response } from 'express'
import helmet from 'helmet'
import passport from 'passport'
import mongoose from 'mongoose'
import Permissions from './Permissions'
import User from './User'
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

app.use('/permissions', Permissions)
app.use('/user', User)
app.use('/auth', auth)
