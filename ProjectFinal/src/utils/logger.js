const { node_env } = require('../config/config.js');
const winston = require('winston');

// Custom logging levels.
const levels = {
  level: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red',
    error: 'yellow',
    warning: 'blue',
    info: 'green',
    http: 'magenta',
    debug: 'white'
  }
};

// Development logger
const loggerDev = winston.createLogger({
  levels: levels.level,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ colors: levels.colors }),
        winston.format.simple()
      )
    })
  ]
});

// Production logger
const loggerProd = winston.createLogger({
  levels: levels.level,
  transports: [
    new winston.transports.File({
      filename: './errors.log',
      level: 'error'
    }),
    new winston.transports.Console({
      level: 'info',
    })
  ]
});

//Middleware function: 
const addLogger = (req, res, next) => {
  req.logger = node_env === 'prod' ? loggerProd : loggerDev;
  req.logger.http(`${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`);
  next();
};

module.exports = addLogger;