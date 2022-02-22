const express = require('express');
require('dotenv').config();
const PORT = process.env.port || 8080;

const accountRoute = require('./routes/account');

const app = express();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on port: ${PORT}`);
});

app.use('/api/account', accountRoute);
