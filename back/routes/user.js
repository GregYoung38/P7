const express = require('express');
const router = express.Router();

const userAuth = require('../middleware/auth');
const reqmax = require("../middleware/limiter");
const multer = require("../middleware/multer");

const userControl = require('../controllers/user');

router.post('/signup', userControl.create_user);
router.post('/login', reqmax.limiter, userControl.connect_user);
router.put('/update/:id', userAuth, multer, userControl.updateUser);
router.post('/refreshToken', userControl.refresh);

router.get('/getUsers', userControl.getAllUsers)
router.get('/getUserById/:id', userControl.getById);

module.exports = router;