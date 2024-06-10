const express = require("express");
const router = express.Router();

const{ registration , login }=require('../controllers/auth');
const validator = require('../middlewares/validator');
const { registrationBody, loginBody } = require('../validations/users');

router.post('/register',validator(registrationBody),registration);
router.post('/login',validator(loginBody),login)

module.exports = router;