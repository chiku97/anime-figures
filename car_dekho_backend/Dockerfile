FROM node:20-alpine

WORKDIR /app

RUN pwd

COPY . .

RUN ls -la
RUN find . -name package.json

RUN npm install

RUN npx prisma generate

RUN chmod +x docker-start.sh

EXPOSE 5000

CMD ["sh", "./docker-start.sh"]