const express = require('express');

//user controller
const { register, login, check } = require('../controller/user.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

//register user
router.post('/register', register);

//login user
router.post('/login', login);

//check user
router.get('/check', auth, check);

module.exports = router;
