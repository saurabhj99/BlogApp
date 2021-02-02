const express=require("express");
const router=express.Router();
const multer=require('multer');
const upload=require("../classes/upload");

const User=require("../models/user");
const Blog=require("../models/blog");
const middleware=require("../middleware/index");







router.get("/",middleware.isLoggedIn,(req,res)=>{
    res.render("createprofile");
})

router.post("/:id",upload.single('profile_image'),middleware.isLoggedIn,(req,res)=>{
    const file=req.file;
    if (req.body){
        
    User.findByIdAndUpdate(req.params.id,{full_name:req.body.f_name,about:req.body.about,twitac:req.body.twitter,profile_pic:req.file.filename},(err,founduser)=>{
        if(err){
            console.log(err);
        }else{
        Blog.updateMany({"author.id":{$eq:req.params.id}},{"author.profile_pic":file.filename},(err,foundBlog)=>{
            if(err){
            console.log(err);
            }else{
                res.redirect("/profile");
            }

        })
         
        }
    })
     }else{
         req.flash("error","Please fill in the given fields")
          res.redirect("back");
          
    }

    
})

module.exports=router;