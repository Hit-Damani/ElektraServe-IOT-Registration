const Format = require('../config/format');

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error occurred';

  if (status >= 500) {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  return res.status(status).json({
    code: status,
    data: null,
    message,
    type: err.type || (status >= 500 ? 'SERVER_ERROR' : 'CLIENT_ERROR'),
  });
}

module.exports = errorHandler;
