const express=require("express");
const router=express.Router(/*{mergerouterams:true}*/);

const Blog=require("../models/blog");
const middleware=require("../middleware/index");


//==================================Create Blog=========================================//
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    res.render('createblog')
    
})
//========================================================================================//


router.post("/new",middleware.isLoggedIn,(req,res)=>{
    const title=req.body.title;
    const image=req.body.image;
    const content=req.body.content;
    const author={id:req.user._id,
        username:req.user.username,profile_pic:req.user.profile_pic};
    const newblog={title:title,image:image,content:content,author:author};
    
    Blog.create(newblog,(err,newBlog)=>{
        if(err){
            console.log(err);
        }
        else{
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
router.put("/:id/edit",middleware.checkBlogOwnership,(req,res)=>{
    const blog={title:req.body.title,image:req.body.image,content:req.body.content};
    Blog.findByIdAndUpdate(req.params.id,blog,(err,updatedBlog)=>{
        if(err){
            res.redirect("/");
        }
        else{
            res.redirect("/blog/"+req.params.id);
        }
    })
})
//=========================================================================================//

module.exports=router;