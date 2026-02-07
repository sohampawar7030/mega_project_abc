FROM node:20-alpine

# OS security patches
RUN apk update && apk upgrade --no-cache

WORKDIR /app

COPY package*.json ./

# safer npm install
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "Server.js"]
