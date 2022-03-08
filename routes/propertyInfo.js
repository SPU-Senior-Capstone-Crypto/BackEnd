//const { Router } = require('express');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')

router.get('/:id', (req, res, next) => {
    if (req.params.id){
        res.send(''+ req.params.id);
    } else {
        res.status(404).send();
    }
});



module.exports = router;