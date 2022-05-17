const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../modules/db');
const Session = require('../modules/session');
const ethers = require('ethers');
const { parseEther } = require('ethers/lib/utils');
const Connection = require('mysql/lib/Connection');

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
        payload.uid = uid;
        try {
            let x = await sell(payload);
            res.send(x);
            //transaction(payload);
        } catch (e) {
            console.log(e);
            res.statusCode = 502;
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

async function sell (payload) {
    const provider = new ethers.getDefaultProvider('ropsten');
    const pWallet = new ethers.Wallet(process.env.WALLET);
    const signer = pWallet.connect(provider);

    const tx = {
        from : pWallet.address,
        to : '0x846C5B8DA1E9D9d4F1b68397bb55EB43E18db800',
        value:ethers.utils.parseUnits('.01', 'ether'),
        gasPrice : provider.getGasPrice(),
        gasLimit : ethers.utils.hexlify(100000),
        nonce : provider.getTransactionCount(pWallet.address, 'latest')
    }

    let x = await signer.sendTransaction(tx);
    return x;
}


module.exports = router;