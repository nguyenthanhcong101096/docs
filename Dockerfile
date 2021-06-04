FROM node:lts as APP

WORKDIR /app/docs

COPY . /app/docs

RUN yarn install

RUN yarn build

EXPOSE 3000

CMD ["npm", "run", "serve"]
