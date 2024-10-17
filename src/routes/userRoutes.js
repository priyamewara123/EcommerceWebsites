const express=require('express');
const { signUp, userLogin } = require('../controllers/userController');
const router=express.Router();
// const {verifyTokenBuyer } = require('../middleware/VerifyTokenOwner');

router.post('/signup',signUp)
router.post('/login',userLogin)
module.exports = router;