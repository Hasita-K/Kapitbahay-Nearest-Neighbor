// backend/app.js
//
// Builds the Express app. Does NOT call listen() — that's server.js, kept
// separate so tests can import the app without booting a real server.

const express = require('express');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/', require('./routes'));

app.use(errorHandler); // must be last — Express only treats 4-arg fns as error handlers

module.exports = app;
