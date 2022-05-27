//const { Router } = require('express');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const pool = require('../modules/db');

router.get('/all', (req, res, next) => {
    query = `Select * from property`;
    pool.getConnection((err, connection) => {
        connection.query(query, (error, result, fields) => {
            connection.release();
            if (error) {
                // if errors
                console.log(error);
            } else {
                res.send(JSON.stringify(result));
            }
        });
    });
});

router.get('/', (req, res, next) => {
    let query = `SELECT * FROM property
                INNER JOIN using (property_id)
                `;

    pool.query(query, (error, result, fields) => {
        if (error){
            res.sendStatus(500);
        } else {
            res.send(JSON.stringify(result));
        }
    });
});

// retrieves property with given id (/api/property/<prop_id>)
router.get('/:id', (req, res, next) => {
    if (req.params.id) {
        // format query string
        query = `Select * from property inner join property_meta using (property_id) having property_id = ${req.params.id}`;
        pool.getConnection((err, connection) => {
            connection.query(query, (error, result, fields) => {
                connection.release();
                if (error) {
                    // if errors
                    console.log(error);
                } else {
                    // returs 404 if length = 0, or if no mathcing id
                    if (result.length == 0) {
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

// Adds new listing with no meta data
router.post('/new-listing', (req, res, next) => {
    let payload = req.body;
    let query = `INSERT INTO property (propery_name, address, value, total_shares, outstanding_shares) VALUES (` +
        `'${payload.propery_name}',` +
        `'${payload.value}',` +
        `'${payload.total_shares}');`;
    pool.query(query, (err, result, fields) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// Add meta data to property
router.put('/new-listing-meta', (req, res, next) => {
    let payload = req.body;
    let query = `INSERT INTO property_meta (property_id, image_meta, desc_meta) VALUES (` +
        `'${payload.property_id}',` +
        `'${payload.image_meta}',` +
        `'${payload.desc_meta}');`;
    pool.query(query, (err, result, fields) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;