// Custom error class.
class CustomError {
  static createError({ code = 1, name = 'Error', cause = 'unknown', message }) {
    const error = new Error(message);
    error.code = code;
    error.name = name;
    error.cause = cause;
    throw error; // Al tirar un error, detenemos la ejecución de la app. 
  }
}

module.exports = CustomError;