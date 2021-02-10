const express=require("express");
const router=express.Router();
const passport=require("passport");


const User=require("../models/user");
const Blog=require("../models/blog");
const middleware = require("../middleware/index");

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
router.post("/login",passport.authenticate("local",{successRedirect:"/",failureRedirect:"/login",failureFlash : true}),(req,res)=>{
})

router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect('/');
})


router.get("/register",(req,res)=>{
    res.render('register');
})

router.post('/register',middleware.checkUserInput,(req,res)=>{
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



router.get("/account/challenge/fgtpswd",(req,res)=>{
    res.render('fgtpswd');
})

router.post("/account/challenge/fgtpswd",middleware.doesUserExists,(req,res)=>{
    const email=req.body.email;
    User.findOne({email:email},(err,foundUser)=>{
        if(err){console.log(err)}
        else{
            res.render("rstpassword",{foundUser:foundUser});
        }
    })
  
})

router.post("/changepswd/:id",(req,res)=>{
    User.findById(req.params.id,async(err,userFound)=>{
        if(err) console.log(err);
        else{
            const userwithHash=await User.findByUsername(userFound.email,true)
            userwithHash.setPassword(req.body.password,function(){
                userwithHash.save();
               req.flash("success","Password reset successfully please login with your new password")
                res.redirect('/login')
                
            });
        }
    })
})
module.exports=router;