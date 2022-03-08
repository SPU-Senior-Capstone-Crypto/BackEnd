//const { Router } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../modules/db');

const router = express.Router();

router.get('/', (req, res, next) => {
    let query = 'SELECT * FROM user;'
    res.send("hit");
    // pool.getConnection((err, connection) => {
    //     connection.query(query, (error, result, fields) => {
    //         connection.release();
    //         if (error){
    //             console.log(error);
    //         } else {
    //             //console.log(result);
    //         }
    //     })
    // })
});

module.exports = router;