// backend/middleware/errorHandler.js
//
// Purpose: one single place that turns any thrown error (from any service,
// anywhere in the app) into the agreed response shape, so every route
// returns errors in the exact same format instead of each person inventing
// their own try/catch and JSON shape.

function errorHandler(err, req, res, next) {
  console.error(err);
  // Log server-side for debugging — never skip this, it's the only trace
  // you'll have during the hackathon when something breaks live.

  const status = err.status || 500;
  // Services should throw errors with a `.status` property set
  // (e.g. `const e = new Error('Not your turn'); e.status = 403; throw e;`).
  // Anything without a status defaults to a generic server error.

  res.status(status).json({
    error: {
      message: err.message || 'Something went wrong',
      status,
    },
  });
}

module.exports = errorHandler;