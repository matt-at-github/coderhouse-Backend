const { EErrors } = require('../services/errors/utils/enums.js');

const errorHandler = (error, req, res, next) => {
  switch (error.code) {
    case EErrors.ROUTE_ERROR:
    case EErrors.INVALID_TYPE:
    case EErrors.DATABASE_ERROR:
    case EErrors.FIELD_MANDATORY:
      res.status(error.code).json({ status: 'error', error: error.nombre });
      break;
    default:
      res.send({ status: 'error', error: 'Error desconocido' });
  }
  next();
};

module.exports = errorHandler;