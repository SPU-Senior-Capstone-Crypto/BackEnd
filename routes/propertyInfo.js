//const { Router } = require('express');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const pool = require('../modules/db');


router.get('/', (req, res, next) => {
    res.sendStatus(302);
});

// retrieves property with given id (/api/property/<prop_id>)
router.get('/:id', (req, res, next) => {
    if (req.params.id){
        // format query string
        query = `Select * from property inner join property_meta using (property_id) having property_id = ${req.params.id}`; 
        pool.getConnection((err, connection) => {
            connection.query(query, (error, result, fields) => {
                connection.release();
                if (error){
                    // if errors
                    console.log(error);
                } else {
                        // returs 404 if length = 0, or if no mathcing id
                    if (result.length == 0){
                        res.status(404).send("not hit");
                    } else {
                        // returns stringified result
                        // returns in response.text
                        res.send(JSON.stringify(result));
                    }
                }
            });
        });
    } else {
        // if no id is given
        res.status(404).send();
    }
});



module.exports = router;