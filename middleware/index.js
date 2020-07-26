const Blog=require("../models/blog");
const Comment=require("../models/comment");
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
module.exports=middlewareObj;
