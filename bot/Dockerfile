FROM    node:latest

RUN     mkdir -p /usr/src/metabot/bot
WORKDIR /usr/src/metabot/bot

COPY    . /usr/src/metabot/bot
RUN     npm install

CMD     ["npm", "start"]
