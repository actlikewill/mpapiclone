FROM node:alpine as base

WORKDIR /app
COPY package.json .
RUN npm install
EXPOSE 3000
COPY . . 

# CMD ["npm", "start"]

FROM base as production

ENV NODE_PATH=./dist

RUN npm run build