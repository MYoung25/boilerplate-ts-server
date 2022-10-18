#!/bin/sh
set -e

# load env from vault in prod
if [ "$NODE_ENV" = "production" ]; then
    source /vault/secrets/env
    yarn permissions:seed
    exec yarn ts-node --transpile-only src/app.ts
fi

# load env from .env
if [ "$NODE_ENV" != "production" ]; then
    source .env
    yarn permissions:seed
    # prettify pino logs in development
    exec yarn nodemon src/app.ts | yarn pino-pretty
fi
