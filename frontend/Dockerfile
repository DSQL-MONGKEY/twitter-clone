FROM node:20 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

FROM nginx:latest

EXPOSE 80

COPY ./nginx/nginx.conf /etc/nginx/conf.d
COPY --from=build /app/dist usr/share/nginx/html