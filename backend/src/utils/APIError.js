function APIError({ status = 500, message = 'Internal Server Error', type = 'API_ERROR' } = {}) {
  const error = new Error(message);
  error.status = status;
  error.type = type;
  error.name = 'APIError';
  Error.captureStackTrace(error, APIError);
  return error;
}

module.exports = APIError;
