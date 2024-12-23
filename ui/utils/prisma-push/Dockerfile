FROM --platform=linux/amd64 node:20-alpine
WORKDIR /code

ARG DATABASE_URL
COPY ../../prisma ./
RUN apk add --no-cache libc6-compat openssl
RUN npm install -g pnpm && pnpm i prisma

CMD npx prisma db push
