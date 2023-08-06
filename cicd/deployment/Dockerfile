FROM node:14-slim

ENV TZ=Asia/Ho_Chi_Minh

WORKDIR /back-end
# Copy package.json and yarn.lock files
COPY ./package.json .
COPY ./yarn.lock .
# Install dependencies
RUN yarn install
# Copy the rest of the files
COPY . .
RUN yarn build
RUN yarn prisma:generate
CMD ["yarn", "start:prod"]