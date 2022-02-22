const { Router } = require('express');
const express = require('express');
const bodyParser = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log("hit account get");
    res.send('Hello World');
});

module.exports = router;