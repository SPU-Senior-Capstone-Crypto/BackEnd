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
        if (result.length === 0){       // if no mathcing email for an acount
            // No valid username
            res.send('No valid username');
        } else {                        // if mathcing email check pswd
            dbUser = result[0];
            bcrpyt.compare(payload.pass, dbUser.pswd, (err, result) => {    // compares the pswd hash and text given
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

/**
 * put route for creating a user account in the db
 * payload is {
 *  email:<sting>
 *  paswd:<string>
 *  first:<string>
 *  last:<string>
 * }
 */
router.put('/create', urlParser, (req, res, next) => {
    let payload = req.body;
    user_exist(payload.email, (result) => {
        if (result){    // email already exists
            res.send('503');
        } else {        // create user
            if (payload.pswd){
                bcrpyt.genSalt(rounds, (err, salt) => { // gen salt
                    bcrpyt.hash(payload.pswd, salt, (err, hash) => {    // gen hash of text password
                        if (error){
                            res.sendStatus(500);    // if error on hashing
                        } else {
                            let query = `INSERT INTO user (first_name, last_name, email, pswd) VALUES (
                                "${payload.first}",
                                "${payload.last}",
                                "${payload.email}",
                                "${payload.pwsd}"
                            );`;
                            // TODO
                            // execute query and return 200 if added
                        }
                    })
                });
            }
            
            res.send('200');
        }
    })
});

/**
 * Verifies if user email exists in db.
 * Calls callback with true if exists and false if otherwise
 * @param {string} email email for user account
 * @param {Callback} fn callback function 
 */
function user_exist (email, fn) {
    let query = `SELECT COUNT(email) FROM user WHERE email = '${email}'`;
    pool.query(query, (error, result, fields) => {  // query db
                if (error || result[0]['COUNT(email)'] > 0){    //  > 0 = exists
                    fn(true);
                } else {
                    fn(false);
                }
                
            });
}


module.exports = router;