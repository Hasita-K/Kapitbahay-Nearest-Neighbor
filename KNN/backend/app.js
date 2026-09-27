// backend/app.js
//
// Purpose: build the Express app — middleware + routes — but do NOT start
// listening here. Keeping app.js separate from server.js means tests can
// import the app object without booting a real network server.

const express = require('express');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
// Parses incoming JSON bodies into req.body.

app.use('/', require('./routes'));
// All actual routes are mounted here, aggregated from routes/index.js.
// This line doesn't change as resources get added — routes/index.js does.

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use(errorHandler);
// MUST be the last app.use() call.

module.exports = app;