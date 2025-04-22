const express = require('express');
const { InfoController } = require('../../controller');


const router = express.Router();
console.log('Inside routes/v1/index.js');

router.get('/info', InfoController.info);


module.exports = router;