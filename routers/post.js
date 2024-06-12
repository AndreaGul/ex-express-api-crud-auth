const express = require("express");
const router= express.Router();
const {store, show ,index ,update,destroy}= require("../controllers/post");
const validator = require("../middlewares/validator");
const { bodyData }= require ('../validations/posts');

const authenticateToken = require('../middlewares/auth');

// router.use(authenticateToken);

router.post('/', validator(bodyData) , store);

router.get('/:slug', show);

router.get('/', index);

router.post('/:slug', validator(bodyData), update);

router.delete('/:slug', destroy);

module.exports= router ;