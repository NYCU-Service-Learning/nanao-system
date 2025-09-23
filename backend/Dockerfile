FROM node:20-bullseye
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
EXPOSE 3000
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh
ENTRYPOINT ["/usr/wait-for-it.sh", "db:3306", "--strict", "--timeout=300", "--"]
CMD npx prisma migrate deploy && node initDB.js && npm run start