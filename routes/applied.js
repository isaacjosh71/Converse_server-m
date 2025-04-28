const router = require('express').Router();
const {verifyToken, verifyAndAuth, verifyAgent} = require('../midddleware/verifyToken');
const appliedController = require('../controllers/appliedController');

//no need for id based on it creates all and get all
router.post('/', verifyAndAuth, appliedController.apply);

router.get('/', verifyAndAuth, appliedController.getApplied);


module.exports = router;