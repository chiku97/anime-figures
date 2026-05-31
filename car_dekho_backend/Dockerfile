FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN chmod +x docker-start.sh

EXPOSE 5000

CMD ["sh", "./docker-start.sh"]
