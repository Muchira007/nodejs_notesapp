const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//login route
router.post('/login', userController.signIn);

//register route
router.post('/register', userController.signUp);

// Update user details route
router.post('/update-user/:id', userController.updateUser);

//get uder by id
router.post('/user/:id', userController.getUser);

module.exports = router;
