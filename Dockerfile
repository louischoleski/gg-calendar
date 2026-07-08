# Install dependencies only when needed
FROM node:20-alpine AS deps

RUN apk --no-cache add python3 make g++
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /home/node

# COPY --chown=node:node package.json yarn.lock package-lock.json ./
COPY --chown=node:node package.json ./

RUN yarn install --frozen-lockfile --network-timeout 1000000

# Rebuild the source code only when needed
FROM node:20-alpine AS builder

WORKDIR /home/node

COPY --chown=node:node --from=deps /home/node/node_modules ./node_modules
COPY --chown=node:node . .

# ENV NEXT_TELEMETRY_DISABLED 1

# RUN yarn build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner

WORKDIR /home/node

# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

RUN apk --no-cache add python3 make g++
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh tree

# COPY --from=builder /app/next.config.js ./
COPY --chown=node:node --from=builder /home/node/node_modules/ ./node_modules/
COPY --chown=node:node --from=builder /home/node/package.json ./package.json
COPY --chown=node:node --from=builder /home/node/public/ ./public/

COPY --chown=node:node .env ./

EXPOSE 3000

ENV PORT 3000

CMD [ "yarn", "start:dev" ]
