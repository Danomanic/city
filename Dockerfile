FROM node:10.13-alpine

ARG mongodb

ENV NODE_ENV production
ENV MONGO_ENV ${mongodb}
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 5000
CMD ls