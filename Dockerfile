FROM node:lts as APP

WORKDIR /app/docs

COPY . /app/docs

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]
