import express, { Request, Response } from 'express'
import mongoose from 'mongoose'

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
