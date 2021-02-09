const mongoose=require('mongoose');
const passport=require('passport');
const crypto=require('crypto');
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

UserSchema.methods.validPassword =async function (password){
        const currentUser= this.model('User');
        const founduser = await currentUser.findByUsername(this.username,true);
        const hash = crypto.pbkdf2Sync(password,  
         founduser.salt,25000,512,`sha256`).toString(`hex`); 
         return (founduser.hash === hash); 
     };
     
UserSchema.plugin(passportLocalMongoose, {usernameQueryFields: ["email"]});
module.exports=mongoose.model('User',UserSchema);