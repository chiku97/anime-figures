FROM node:20-alpine AS builder

WORKDIR /app

COPY car-dekho-frontend/package*.json ./
RUN npm install

COPY car-dekho-frontend .

ARG VITE_API_BASE=http://localhost:5000/api/v1
ENV VITE_API_BASE=${VITE_API_BASE}

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]
