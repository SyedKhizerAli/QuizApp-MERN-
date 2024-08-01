const express = require('express');
const router = express.Router();
const userController = require('../Controllers/User');
const {validateSignUp, validateLogin, generateToken} = require('../Middlewares/UserMiddleware');

router.post('/login', validateLogin, userController.Login, generateToken);
router.post('/signup', validateSignUp, userController.SignUp, generateToken); 


module.exports = router;
