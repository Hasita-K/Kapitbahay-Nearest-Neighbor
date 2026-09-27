// backend/app.js
//
// Builds the Express app. Does NOT call listen() — that's server.js, kept
// separate so tests can import the app without booting a real server.

const express = require('express');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Expo web runs in a browser and needs CORS permission to call the API.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/', require('./routes'));

app.use(errorHandler); // must be last — Express only treats 4-arg fns as error handlers

module.exports = app;
