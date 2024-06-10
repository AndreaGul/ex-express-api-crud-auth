const jwt = require("jsonwebtoken");
require("dotenv").config();

generateToken= (payload, expiresIn = '1h') => jwt.sign(payload,process.env.JWT_SECRET, {expiresIn});

module.exports = generateToken;