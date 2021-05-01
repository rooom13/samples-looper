FROM node:14.16.1-alpine

# TODO: properly deployt he app
ENV DANGEROUSLY_DISABLE_HOST_CHECK true 

COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile

RUN mkdir API
COPY API/package.json API/yarn.lock ./API/
RUN cd API && yarn install --pure-lockfile

COPY client/package.json client/yarn.lock ./client/
RUN cd client && yarn install --pure-lockfile

COPY API API
COPY client client

CMD yarn start

# docker run -dp 3000:3000 samples-looper 
# heroku container:login
# heroku container:push web
# docker push registry.heroku.com/samples-looper/web
# heroku container:release web
