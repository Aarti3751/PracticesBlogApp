const express=require('express')
const { getBlog, getUserBlog, create, likeBlog, commentBlog, deleteBlog, adminGetAllBlogs, updateBlog } = require('../controllers/blogController')
const { protect, admin } = require('../middleware/auth')



const router=express.Router()

router.get('/',getBlog)

router.get('/:id/userblog',protect,getUserBlog)

//Admin-only route to fetch all blogs

router.get('/admin',protect,admin,adminGetAllBlogs)


//protected user routes
router.post('/create',protect,create)

router.post('/:id/like',protect,likeBlog)

router.post('/:id/comments',protect,commentBlog)

//  router.delete('/:id/delete',protect,deleteBlog)


//CRUD routes

router.put('/:id',protect,admin,updateBlog)//admin or blog owner can update

router.delete('/delete/:id',protect,admin,deleteBlog)


module.exports=router