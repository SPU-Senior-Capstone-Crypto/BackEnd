const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../modules/db');
const Session = require('../modules/session');
const ethers = require('ethers');

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
    sesh.getUser( payload.ssid, async (uid) => {
        if (uid < 0){
            res.sendStatus(500);
            return;
        }
        payload.uid = uid;
        try {
            if (payload.shares < 0){
                let x = await sell(payload);
                res.send(JSON.stringify(x));
            } else {
                transaction(payload);
                res.sendStatus(200);
            }
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
});

function transaction (payload){
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

/**
 * Mimics the sell of a number of shares
 * Transfers the necessary eth from parity wallet to user's
 * Async using ethers on ropsten network with default provider
 * @param {object} payload all transaction data from front end
 * @returns transaction object once complete
 */
async function sell (payload) {
    const provider = new ethers.getDefaultProvider('ropsten');
    const pWallet = new ethers.Wallet(process.env.WALLET);
    const signer = pWallet.connect(provider);

    const tx = {
        from : pWallet.address,
        to : payload.r,
        value: payload.value,
        gasPrice : provider.getGasPrice(),
        gasLimit : ethers.utils.hexlify(100000),
        nonce : provider.getTransactionCount(pWallet.address, 'latest')
    }

    let x = await signer.sendTransaction(tx);

    let query = `
        INSERT INTO transaction (user_id, property_id, shares, principle, hash, sender, recipient) 
        Values (
            '${payload.uid}',
            '${payload.property_id}',
            '${payload.shares}',
            '${payload.value}',
            '${x.hash}',
            '${pWallet.address}',
            '${payload.r}'
        );
    `;
    pool.query(query, (error, result, fields) => {
        if (error){
            throw(error);
        }
    });

    return x;
}

module.exports = router;