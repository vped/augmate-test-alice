const express = require('express');
let router = express.Router();
let alice = require('../controllers/aliceCtrl');

router.get('/getCryptoPrice/:symbol',alice.getCryptoPrice);
router.get('/getDescription/:symbol',alice.getDescription);
router.post('/saveDescription',alice.saveDescription);
router.get('/getSaveNotification',alice.getSaveNotification);
router.get('/getSavedDescription/:uid',alice.getSavedDescription);



module.exports = router;
