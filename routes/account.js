//const { Router } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../modules/db');
const bcrpyt = require('bcrypt');
const rounds = 10;



const router = express.Router();

const urlParser = bodyParser.urlencoded({extended:false});

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


// Check if user pass and email match.
// true if yes, false if no
router.post('/log', urlParser, (req, res, next) => {
    let payload = req.body;
    query = `SELECT * FROM user WHERE email = '${payload.email}' `;
    pool.query(query, (error, result, fields) => {
        if (error){
            res.send(error);
        }
        if (result.length === 0){
            // No valid username
            res.send('No valid username');
        } else {
            dbUser = result[0];
            bcrpyt.compare(payload.pass, dbUser.pswd, (err, result) => {
                if (result){
                    res.send(result)
                    // Create user sessions
                } else {
                    res.send("Incorrect Login info");
                }
                
                return;
            });
        }
    });
    return;
});


module.exports = router;