// backend/server.js
//
// Purpose: the actual entry point you run. Boots the app built in app.js.

require('dotenv').config();
// Loads .env into process.env — must happen before anything reads
// process.env, so this line has to be first.

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});