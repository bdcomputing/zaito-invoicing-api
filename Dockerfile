# Step 1
FROM node:lts-alpine AS development

WORKDIR /usr/src/app

COPY package*.json .npmrc ./
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm i

COPY . .

RUN npm run build

FROM node:lts-alpine AS production


ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN apk update && apk add --no-cache nmap && \
    echo @edge https://dl-cdn.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge https://dl-cdn.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
    chromium \
    harfbuzz \
    "freetype>2.8" \
    ttf-freefont \
    nss

WORKDIR /usr/src/app

COPY package*.json .npmrc ./

RUN npm install --omit=dev

COPY . .

COPY --from=development /usr/src/app/dist ./dist

# Expose port
EXPOSE 3000

# RUN chmod -R 777 /app

# Start the server
CMD ["npm", "run", "start:prod"]