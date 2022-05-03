const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../modules/db');
const Session = require('../modules/session');

const router = express.Router();

const jsonParser = bodyParser.json();

/** 
 * Performs transaction
 * payload:
 * {
 *      shares:<number>
 *      value:<string>(hash base 16)
 *      hash:<string>
 *      sender:<string>
 *      recipient:<string>
 *      property_id:<string>
 *      ssid:<number>
 * }
 */
router.post('/', jsonParser, (req, res, next) => {
    let payload = req.body;
    let sesh = new Session();
    sesh.getUser( payload.ssid, (uid) => {
        payload.uid = uid;
        try {
            transaction(payload, res);
        } catch (e) {
            res.send(502);
        }
    });
    res.sendStatus(200);
});

function transaction (payload, res){
    delete payload.ssid;
    let query = `
        INSERT INTO transaction (user_id, property_id, shares, principle, hash, sender, recipient) 
        Values (
            '${payload.uid}',
            '${payload.property_id}',
            '${payload.shares}',
            '${payload.value}',
            '${payload.hash}',
            '${payload.sender}',
            '${payload.recipient}'
        );
    `;
    pool.query(query, (error, result, fields) => {
        if (error){
            throw(error);
        }
    });
}

module.exports = router;