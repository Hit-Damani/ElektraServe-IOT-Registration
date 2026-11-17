const Format = {
  success: (data = null, message = 'Success') => ({
    code: 200,
    data,
    message,
  }),

  created: (data = null, message = 'Created successfully') => ({
    code: 201,
    data,
    message,
  }),

  noContent: (message = 'No Content') => ({
    code: 204,
    data: null,
    message,
  }),

  badRequest: (data = null, message = 'Bad Request') => ({
    code: 400,
    data,
    message,
  }),

  notFound: (data = null, message = 'Not Found') => ({
    code: 404,
    data,
    message,
  }),

  conflict: (data = null, message = 'Conflict') => ({
    code: 409,
    data,
    message,
  }),

  internalError: (data = null, message = 'Internal Server Error') => ({
    code: 500,
    data,
    message,
  }),
};

module.exports = Format;
