FROM node:16-alpine AS build
WORKDIR /app
RUN apk add --no-cache --virtual .build-deps build-base python3
COPY package*.json ./
RUN npm install && npm rebuild bcrypt --build-from-source
COPY prisma/schema.prisma ./prisma/
COPY prisma/migrations ./prisma/migrations/
RUN npm install -g prisma && prisma generate
COPY . .
RUN npm run build
RUN apk del .build-deps

FROM node:16-alpine
WORKDIR /app
RUN apk add --no-cache bash
COPY --from=build /app .
RUN npm install --production
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh
EXPOSE 3000
ENTRYPOINT ["/usr/wait-for-it.sh", "db:3306", "--strict", "--timeout=300", "--"]
CMD npx prisma migrate deploy && node /app/initDB.js && node dist/src/main
