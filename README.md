# metabot [![Build Status](https://travis-ci.org/Duelist/metabot.svg?branch=master)](https://travis-ci.org/Duelist/metabot) [![Coverage Status](https://coveralls.io/repos/github/Duelist/metabot/badge.svg?branch=master)](https://coveralls.io/github/Duelist/metabot?branch=master)

## Installation

- `yarn install`
- Navigate to `node_modules/node-opus`
- Run `node-gyp rebuild --python python2.7`

`node-gyp` at the time of writing does not support python3. (Fun)

## Running the bot

### Local

- `yarn run bot-local`

### Docker

- `docker-compose up --build`

## Testing

- Run tests: `yarn test`
- Run linting: `yarn run lint`
- Run specific test: `yarn run test-grep <test>`
