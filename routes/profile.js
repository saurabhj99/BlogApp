const express=require("express");
const router=express.Router();
const multer=require('multer');
const upload=require("../module/upload");
const fs = require('fs');
const path=require('path');

const User=require("../models/user");
const Blog=require("../models/blog");
const middleware=require("../middleware/index");


router.get("/",middleware.isLoggedIn,(req,res)=>{
    res.render("createprofile");
})

//Handles Image Upload
router.post("/:id/uploadimage", upload.single('profile_image'),middleware.isLoggedIn,(req,res)=>{
    const file=req.file;
    if (req.file){
        //Deletes the previous picture uploaded
        if(req.user.profile_pic){
        const filePath = path.join(__dirname,'..','uploads',`${req.user.profile_pic}`)
        fs.unlinkSync(filePath);}
        
            User.findByIdAndUpdate(req.params.id,{profile_pic:req.file.filename},(err,founduser)=>{
                if(err){
                    console.log(err);
                }
                //If blog post exists
                if(req.user.blogCount>0){
                    Blog.updateMany({"author.id":{$eq:req.params.id}},{"author.profile_pic":file.filename},(err,foundBlog)=>{
                        if(err){
                        console.log(err);
                        }
                        else{
                            res.json({message:'success'});
                        }
                        });
                    }else{
                        res.json({message:'success'})
                    }
            })
    }else{
        res.json({message:'failure'});
    }
})

//Handles user information
router.post("/:id",middleware.isLoggedIn,(req,res)=>{
    User.findByIdAndUpdate(req.params.id,{full_name:req.body.f_name,about:req.body.about,twitac:req.body.twitter,instac:req.body.instagram,fbpg:req.body.facebook},async(err,founduser)=>{
        if(err){
            console.log(err);
        }else{
            await Blog.find({"author.id":req.params.id}).updateMany({"author.full_name":req.body.f_name});
            req.flash("success","Details Updated SuccessFully")
            res.redirect("back");
        }

    })
        
})

module.exports=router;