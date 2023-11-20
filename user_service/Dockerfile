FROM node:18-alpine

WORKDIR /app/user_service

copy package.json .

RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm", "start"]