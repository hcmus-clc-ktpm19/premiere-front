FROM node:16.6.0-alpine3.14
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["/bin/sh", "-c", "yarn build;yarn preview"]