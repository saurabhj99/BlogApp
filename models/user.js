const mongoose=require('mongoose');
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');
const UserSchema=new mongoose.Schema({
    email: String,
    username:String,
    password:String,
    full_name:String,
    about:String,
    follower:[{type:mongoose.Schema.Types.ObjectId}],
    following:[{type:mongoose.Schema.Types.ObjectId}],
    gender:String,
    profile_pic:String,
    twitac:String,
    instac:String,
    fbpg:String,
    })
UserSchema.plugin(passportLocalMongoose, {usernameQueryFields: ["email"]});
module.exports=mongoose.model('User',UserSchema);