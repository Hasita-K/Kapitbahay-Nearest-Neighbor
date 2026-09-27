// backend/middleware/errorHandler.js
//
// One place that turns any thrown error into { error: { message, status } }.
// Services throw errors with a `.status` property set; anything without
// one defaults to 500.

function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: { message: err.message || 'Something went wrong', status },
  });
}

module.exports = errorHandler;
