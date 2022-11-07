FROM node:14

WORKDIR /be-app

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install

COPY . .

RUN yarn prisma generate --schema=./node_modules/university-management-db/prisma/schema.prisma
RUN yarn build

EXPOSE 3003
CMD ["yarn","start"]

