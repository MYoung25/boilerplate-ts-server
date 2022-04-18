import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import Permissions from './Permissions'
import auth from './auth'

export const app = express()

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
app.use('/auth', auth)
