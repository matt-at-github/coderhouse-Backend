const responseAPI = (res, status, message, error = undefined) => {
  res.status(status).json({ message, error });
};

// TODO: to be handled byu the front end
const responseDialog = (res, status, message, error = undefined) => {
  res.status(status).render('logout', { message: `${message} ${error}` });
};

module.exports = { responseAPI, responseDialog };