FROM node:18-alpine

WORKDIR /app/product_service

copy package.json .

RUN npm install

COPY . .

EXPOSE 8002

CMD ["npm", "start"]