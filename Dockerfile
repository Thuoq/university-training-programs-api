# Base Image
FROM node:14-alpine As development

# WORKING app directory
WORKDIR /usr/src/app
# A wildcard is used to ensure both package.json AND yarn-lock.json are copied
COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

# Creates a "dist" folder with the production build
RUN  yarn
COPY --chown=node:node . .
USER node
# Start the server using the production build
CMD [ "node", "dist/main.js" ]
