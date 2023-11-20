FROM node:18-alpine

WORKDIR /app/order_service

copy package.json .

RUN npm install

COPY . .

EXPOSE 8003

CMD ["npm", "start"]