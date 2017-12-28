FROM node:8

WORKDIR /code
ENTRYPOINT node src/bin/www

COPY package.json package-lock.json /code/
RUN npm install

COPY ./ /code/

EXPOSE 3000
