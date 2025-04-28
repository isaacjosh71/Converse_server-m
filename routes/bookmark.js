const router = require('express').Router();
const {verifyToken, verifyAndAuth, verifyAgent} = require('../midddleware/verifyToken');
const bookmarkController = require('../controllers/bookmarks');

//Create bookmark
router.post('/', verifyAndAuth, bookmarkController.createBookmarks);

//delete
router.delete('/:id', verifyAndAuth, bookmarkController.deleteBookmark);

//get all
router.get('/', verifyAndAuth, bookmarkController.getAllBookmark);

//get a single
router.get('/bookmark/:id', verifyAndAuth, bookmarkController.getBookmark);


module.exports = router;