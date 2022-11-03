const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

const postsCtrl = require('../controllers/posts');

/* publications */
router.post('/getPosts', auth, postsCtrl.getPosts);
router.get('/getPost/:id', auth, postsCtrl.getOnePost);
router.post('/createPost', auth, multer, postsCtrl.create_new);
router.put('/updatePost/:id', auth, multer, postsCtrl.updatePost);
router.delete("/deletePost/:id", auth, postsCtrl.deletePost);


/* commentaires */
router.post('/:id/getComments', auth, postsCtrl.getComments);
router.post('/:id/createComment', auth, postsCtrl.createComment);
router.put('/:id/updateComment', auth, postsCtrl.updateComment);
router.delete("/deleteComment/:id", auth, postsCtrl.deleteComment);


/* Commun aux publications comme aux commentaires */
router.post("/:id/like", auth, postsCtrl.reactPost);

module.exports = router;