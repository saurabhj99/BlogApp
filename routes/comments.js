const express=require("express");
const router=express.Router({mergeParams:true});


const Blog=require("../models/blog");
const Comment=require("../models/comment");
const middleware=require("../middleware/index");

//====================================Comments Route=======================================//
router.get("/",middleware.isLoggedIn,(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){ console.log(err);}
        else{
            res.render('addcomment',{foundBlog:foundBlog});
        }
    })
    
})
router.post("/",middleware.isLoggedIn,(req,res)=>{
    console.log(req.params.id);
    Blog.findById(req.params.id,(err,foundblog)=>{
        if(err){
            console.log(err);
        }else{
            Comment.create({text:req.body.text},(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    foundblog.comments.push(comment);
                    foundblog.save();
                    res.redirect("/blog/"+ foundblog._id);
                }
            })
        }
    })
})
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
            if(err||!foundBlog){
                req.flash("error","No Blog find");
                res.redirect("back");
            }
           
    Comment.findById(req.params.comment_id,(err,foundComment)=>{
        if(err){ console.log(err);}
        else{
            res.render('editcomment',{blog_id:req.params.id,comment:foundComment});
        }
    })
})
})
router.put("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id,{text:req.body.text,created:Date.now()},(err,updatedcomment)=>{
        if(err){
            res.redirect("/");
        }
        else{
            res.redirect("/blog/"+req.params.id);
        }
    })
})
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
 Comment.findByIdAndRemove(req.params.comment_id,(err,foundcomment)=>{
      if(err){
          console.log(err);
      }
      else{
          Blog.updateOne( {_id:req.params.id},{ $pull: {comments:req.params.comment_id} },(err,Blogfound)=>{
              if(err){
                  console.log(err);
              }
              else{
                  console.log(Blogfound);
                res.redirect('/blog/'+req.params.id);
              }
          })
          
      }
 })
})

module.exports=router;