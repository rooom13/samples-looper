FROM node:14.16.1 as build-deps

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./

RUN yarn build

FROM nginx:1.17-alpine

COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
CMD  sed -i 's/80/'"$PORT"'/' /etc/nginx/conf.d/default.conf && nginx -g "daemon off;"
EXPOSE ${PORT}

# docker run  -p 80:80 imageId