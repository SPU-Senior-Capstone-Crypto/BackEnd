var express = require('express');
require('dotenv').config();
const PORT = process.env.port || 3001;

const accountRoute = require('./routes/account');
const propInfoRoute = require('./routes/propertyInfo');
const transactionRouute = require('./routes/transaction')

var cors = require('cors');

var app = express();
app.use(cors());

app.use('/api/account', accountRoute);
app.use('/api/property', propInfoRoute);
app.use('/api/transaction', transactionRouute);


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on port: ${PORT}`);
});

module.exports = app;
