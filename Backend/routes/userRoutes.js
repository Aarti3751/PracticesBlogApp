const express=require('express')
const { register, login, getProfile, adminLogin} = require('../controllers/userController')
const {  protect, admin} = require('../middleware/auth')

const router=express.Router()


router.post('/register',register)

router.post('/login',login)

router.post('/adminlogin', protect, admin, adminLogin);

router.get('/profile',protect,getProfile)

module.exports=router

