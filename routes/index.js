const express=require("express");
const router=express.Router();
const passport=require("passport");


const User=require("../models/user");
const Blog=require("../models/blog");
const middleware=require("../middleware/index");

//==============================Landing Page=================================================//
router.get("/",(req,res)=>{
    Blog.find({},(err,Blogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('home',{Blogs:Blogs});
        }
    })
    
})
//=======================================================================================//


router.get("/login",(req,res)=>{
    res.render('login');
})
router.post("/login",passport.authenticate("local",{successRedirect:"/",failureRedirect:"/login"}),(req,res)=>{
})

router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect('/');
})


router.get("/register",(req,res)=>{
    res.render('register');
})

router.post('/register',(req,res)=>{
    const user={username:req.body.username,email:req.body.email,gender:req.body.gender};
    User.register(user,req.body.password,(err,usercreated)=>{
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate('local')(req,res,()=>{
                req.flash("success","Welcome to Daily Blogs "+ user.username);
                res.redirect("/");
            })
        }
    })
    
})
module.exports=router;