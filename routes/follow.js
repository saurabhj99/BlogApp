const express=require("express");
const router=express.Router(/*{mergerouterams:true}*/);

const User=require("../models/user");
const middleware=require("../middleware/index");

router.post("/",async(req,res,next)=>{
    const follower=req.body.follower;
    const following  =req.body.following;
    const action  = req.body.action;
    let text
    try {
        switch(action) {
            case 'Follow':
                await Promise.all([ 
                    User.findByIdAndUpdate(follower, { $push: { following: following }}),
                    User.findByIdAndUpdate(following, { $push: { follower: follower }}),
                    text="Followed"
                ]);
            break;

            case 'Unfollow':
                await Promise.all([ 
                    User.findByIdAndUpdate(follower, { $pull: { following: following }}),
                    User.findByIdAndUpdate(following, { $pull: { follower: follower }}),
                    text="Follow"
                
                ]); 
            break;

            default:
                break;
        }
        
        res.redirect("back")
        
    } catch(err) {
        res.json({ done: false });
    }


  
})

module.exports=router;