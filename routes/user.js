const router = require('express').Router();
const {verifyToken, verifyAndAuth, verifyAgent} = require('../midddleware/verifyToken');
const userController = require('../controllers/userController');

//get user
router.get('/', verifyAndAuth, userController.getUser);


router.delete('/:id', verifyAndAuth, userController.deleteUser);

router.put('/', verifyAndAuth, userController.updateUser);

router.put('/', verifyAndAuth, userController.updateProfileImage);

//skills

router.post('/skills', verifyAndAuth, userController.addSkills);

router.get('/skills', verifyAndAuth, userController.getSkills);

router.delete('/skills/:id', verifyAndAuth, userController.deleteSkills);

//agents
router.post('/agents', verifyAndAuth, userController.addAgent);

router.get('/agents/:uid', verifyAndAuth, userController.getAgent);

router.put('/agents/:id', verifyAndAuth, userController.updateAgent);

router.get('/agents', verifyAndAuth, userController.getAgents);


module.exports = router;