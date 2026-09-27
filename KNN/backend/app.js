const express = require('express');
const foodRequestsRouter = require('./routes/foodRequests');

const app = express();
app.use(express.json());
app.use('/food-requests', foodRequestsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));