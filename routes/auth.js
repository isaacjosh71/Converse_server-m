const router = require('express').Router();
const authController = require('../controllers/authController');

//no need for id based on it creates all and get all
router.post('/register', authController.createUser);

router.post('/login', authController.loginUser);

router.put('/password', authController.updatePassword);


module.exports = router;