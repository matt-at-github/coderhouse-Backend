const dotenv = require('dotenv');
const program = require('../utils/commander.js');

const { mode } = program.opts();

dotenv.config({
  path: mode === 'prod' ? './.env.prod' : './.env.dev'
});

const configObject = {
  mongoConnection: { url: process.env.MONGO_URL, timeToLive: process.env.MONGO_TTL },
  cookie_parser: { secret_key: process.env.COOKIE_PARSER_SECRET_KEY },
  port: process.env.PORT
};

module.exports = configObject;
