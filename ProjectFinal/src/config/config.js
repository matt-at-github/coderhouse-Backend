const dotenv = require('dotenv');
const program = require('../utils/commander.js');

const { mode } = program.opts();

dotenv.config({
  path: mode === 'prod' ? './.prod.env' : './.dev.env'
});

const projectConfiguration = {
  mongo: { timeToLive: 86400 },
  cookie_parser: {},
  jwt: { tokenLife: '24h', tokenShortLife: '1h', tokenName: 'OnlyShopToken' },
  bcrypt: {}
};

const configObject = {
  domain: process.env.DOMAIN,
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoConnectionConfig: {
    url: process.env.MONGO_URL,
    timeToLive: projectConfiguration.mongo.timeToLive
  },
  cookieParserConfig: {
    secret_key: process.env.COOKIE_PARSER_SECRET_KEY,
    life_span: process.env.COOKIE_LIFE_SPAN
  },
  jwtConfig: {
    secretOrKey: process.env.JWT_SECRET_OR_KEY,
    tokenName: projectConfiguration.jwt.tokenName,
    shortLife: projectConfiguration.jwt.tokenShortLife,
    tokenLife: projectConfiguration.jwt.tokenLife
  },
  passportConfig: {
    github: {
      clientId: process.env.PASSPORT_GITHUB_CLIENT_ID,
      clientSecret: process.env.PASSPORT_GITHUB_CLIENT_SECRET
    }
  },
  nodemailConfig: {
    accountSupport: process.env.MAILER_ACCOUNT_SUPPORT,
    password: process.env.MAILER_PASSWORD
  },
};

module.exports = configObject;
