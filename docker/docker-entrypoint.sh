#!/bin/sh
set -e

yarn
yarn add bcrypt@5.0.0

# load env from vault in prod
if [ "$NODE_ENV" = "production" ]; then
#  source /vault/secrets/env
  yarn permissions:seed
  exec yarn ts-node src/app.ts
#  exec yarn ts-node src/app.ts
fi

# load env from .env
if [ "$NODE_ENV" != "production" ]; then
  source .env
  yarn permissions:seed
  # prettify pino logs in development
  exec yarn nodemon src/app.ts #| ./node_modules/.bin/pino-pretty
fi
