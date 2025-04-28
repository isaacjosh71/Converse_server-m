const router = require('express').Router();
const jobController = require('../controllers/jobControllers');

//no need for id based on it creates all and get all
router.post('/', jobController.createJob);

router.get('/', jobController.getAllJobs);

//protected route because on agent can access to post, delete and update

//: means the object users add
router.get('/:id', jobController.getJob);

router.put('/:id', jobController.updateJob);

router.delete('/:id', jobController.deleteJob);

// (/search/:key(param from ctrl) as seen from postman afterwards the api/jobs from index)
router.get('/search/:key', jobController.searchJob);

router.get('/agent/:uid', jobController.getAgentJobs);


module.exports = router;