// const express=require('express')
// const { protect, admin } = require('../middleware/auth')
// const { getAllUsers, getUserDetails, getUserUpdate, getUserDelete } = require('../controllers/adminController')

// const router=express.Router()

// router.get('/user',protect,admin,getAllUsers)

// router.get('/user/:id',protect,admin,getUserDetails)

// router.put('/user/:id',protect,admin,getUserUpdate)

// router.delete('/user/:id',protect,admin,getUserDelete)

// module.exports=router



const express = require('express');
const { protect, admin } = require('../middleware/auth'); // Middlewares for protection and admin check
const { 
  getAllUsers, 
  getUserDetails, 
  getUserUpdate, 
  getUserDelete 
} = require('../controllers/adminController'); // Controller functions for the routes

const router = express.Router();

// Route to get all users, protected by 'protect' and 'admin' middlewares
router.get('/user', protect, admin, getAllUsers);

// Route to get details of a specific user by ID, protected by 'protect' and 'admin' middlewares
router.get('/user/:id', protect, admin, getUserDetails);

// Route to update a user's details by ID, protected by 'protect' and 'admin' middlewares
router.put('/user/:id', protect, admin, getUserUpdate);

// Route to delete a user by ID, protected by 'protect' and 'admin' middlewares
router.delete('/user/:id', protect, admin, getUserDelete);

module.exports = router;
