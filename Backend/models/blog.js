const mongoose=require('mongoose')
const User = require('../models/user')

const blogSchema=mongoose.Schema({
    // image:{type:String,required:true},
    title:{type:String,required:true},
    content:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    comments:[
        {
            user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
            comment:{type:String,required:true},
        },

    ],
},{timestamps:true});


module.exports=mongoose.model('Blog',blogSchema)