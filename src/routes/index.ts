import express, { Request, Response } from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { setupPassport } from "./auth"
import Permissions from './Permissions'
import Roles from './Roles'
import Users from './Users'
import auth from './auth'

export const app = express()

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.use('/roles', Roles)
app.use('/users', Users)
app.use('/auth', auth)
