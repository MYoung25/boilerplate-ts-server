const fs = require('fs')

module.exports = function () {
    const routes = fs.readdirSync('./src/routes/')
    .filter(route => route != 'index.ts' && !route.includes('test'))
    .map(route => route.replace('.ts', ''))
    .sort()

    return `import express, { Request, Response } from 'express'
import passport from 'passport'
import mongoose from 'mongoose'
${
    routes
        .map(route => 'import ' + route + ' from \'./' + route + '\'')
        .join('\n')
}

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
app.use(passport.initialize())
app.use(passport.session())

${
    routes
        .map(route => 'app.use(\'/' + route.toLowerCase() + '\', ' + route + ')')
        .join('\n')
}
`
}
