const Blog=require("../models/blog");
const User=require("../models/user");
const Comment=require("../models/comment");
const upload = require("../module/upload");
const middlewareObj={}

middlewareObj.checkBlogOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
           if(err||!foundBlog){
            req.flash("error","Blog not found");
               res.redirect("back");
           }  
           else {
               // does user own the Blog?
            if(foundBlog.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error","You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    }
     else {
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }

}

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");

}
//middleware
 middlewareObj.checkCommentOwnership=function (req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err||!foundComment){
               req.flash("error","comment not found")
               res.redirect("back");
           }  
           else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error","You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    }
     else {
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }

}

//Handles the Signup page

middlewareObj.checkUserInput=(req,res,next)=>{
    const username=req.body.username;
    const password=req.body.password;
    const email=req.body.email;
    if(!username||!password||!email){
        req.flash("error","Please fill in the given fields");
        res.redirect("back");
    }else{
        User.findOne({username:username},(err,foundUser)=>{
            if(err){
                req.flash("error","User with given username already exists");
                res.redirect("back");
            }
            if(foundUser){
                req.flash("error","User with given username already exists please login");
                res.redirect("back");
            }
            else{
                next();
            }
        })
    }
}


//Handles user password change 
middlewareObj.doesUserExists=(req,res,next)=>{
        User.findOne({email:req.body.email},(err,foundUser)=>{
            if(err){
                console.log(err);
            }
            if(!foundUser){
                req.flash("error","User Doesn't Exist");
                res.redirect('back');
            }
            else{
                next();
            }
        })}
        


module.exports=middlewareObj;
