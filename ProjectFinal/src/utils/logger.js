const winston = require('winston');

// Custom logging levels.
const levels = {
  level: {
    fatal: 5,
    error: 4,
    warning: 3,
    info: 2,
    http: 1,
    debug: 0
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

const logger = winston.createLogger({
  levels: levels.level,
  transports: [
    new winston.transports.Console({
      level: 'http',
      format: winston.format.combine(
        winston.format.colorize({ colors: levels.colors }),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: './errors.log',
      level: 'warning',
      format: winston.format.simple()
    })
  ]
});

//Middleware function: 
const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(`${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`);
  next();
};

module.exports = addLogger;