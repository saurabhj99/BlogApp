const express=require("express");
const router=express.Router(/*{mergerouterams:true}*/);
const Blog=require("../models/blog");
const User=require("../models/user");
const middleware=require("../middleware/index");
const upload=require("../module/upload");
const user = require("../models/user");

//==================================Create Blog=========================================//
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    res.render('createblog')
    
})
//========================================================================================//


router.post("/new",upload.single('image'),middleware.isLoggedIn,(req,res)=>{
    const title=req.body.title;
    const image=req.file.filename;
    const content=req.body.content;
    const BlogCount=req.user.blogCount+1
    
    const author={full_name:req.user.full_name,id:req.user._id,
        username:req.user.username,profile_pic:req.user.profile_pic};
    const newblog={title:title,image:image,content:content,author:author};
    
    Blog.create(newblog,async(err,newBlog)=>{
        if(err){
            console.log(err);
        }
        else{
            await User.findByIdAndUpdate(req.user._id,{blogCount:BlogCount})
            res.redirect("/");
        }
    })
}) 


//=======================================Show Blog========================================//
router.get("/:id",(req,res)=>{
    Blog.findById(req.params.id).populate('comments').exec((err,Blog)=>{
        if(err){
            res.redirect('/');
        }else{
            res.render('blog',{Blog:Blog});
        }

    })
})
//=========================================================================================//
//======================================Edit blog==========================================//
router.get("/:id/edit",middleware.checkBlogOwnership,(req,res)=>{
   
    Blog.findById(req.params.id,(err,foundBlog)=>{
           if(err){
               console.log(err);
           }else{
                res.render('editblog',{foundBlog:foundBlog});
           }
    })
    

})
router.put("/:id/edit",upload.single('image'),middleware.checkBlogOwnership,(req,res)=>{
    const title=req.body.title;
    const image=req.file.filename;
    const content=req.body.content;
    const updatedBlog={title:title,image:image,content:content};
    
    Blog.findByIdAndUpdate(req.params.id,updatedBlog,async(err,updatedBlog)=>{
        if(err){
            res.redirect("/");
        }
        else{
            req.flash("success","Post updated successfully");
            res.redirect("/blog/"+req.params.id);
            
        }
    })
})
//=========================================================================================//


router.delete("/:id/delete",middleware.checkBlogOwnership,(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,async(err,deletedBlog)=>{
        if(err){
            res.redirect("/");
        }
        else{
            await User.findByIdAndUpdate(req.user._id,{blogCount:req.user.blogCount-1})
            req.flash("success","Post deleted successfully");
            res.redirect("/");
            
        }
    })
})


//=========================================================================================//
module.exports=router;