const express=require("express");
const app=express();
const path=require('path');
const bodyParser=require('body-parser');
const methodOverride=require("method-override");
const mongoose=require('mongoose');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const passportLocalMongoose=require('passport-local-mongoose');
const session=require('express-session');
const flash=require("connect-flash");
const multer=require('multer');

const Blog=require('./models/blog');
const User=require('./models/user');
const Comment=require('./models/comment');
const middleware=require("./middleware/index");
const PORT=process.env.PORT ||5000;
const Ip=process.env.IP ||'0.0.0.0';
const url =process.env.DATABASEURL||"mongodb://localhost:27017/Daily_Blogs";

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/profile', express.static('uploads'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

const commentRoutes=require("./routes/comments");
const BlogRoutes=require("./routes/blogs");
const indexRoutes=require("./routes/index");
const followRoutes=require("./routes/follow");
const profileRoutes=require("./routes/profile");

app.use(flash());

app.use(session({
    secret:'Secret',
    resave:false,
    saveUninitialized:false

}));
app.use(passport.initialize());
app.use(passport.session());

//Handles the user login
passport.use(new LocalStrategy({
    usernameField:"username",
    passwordField:"password"  
    
},(username,password,done)=>{
    User.findOne({$or:[{email:username},{username:username}]},async(err,user)=>{
        if(err){
            return done(err)
        }
        if(!user){
            return done(null,false,{message:"Incorrect Username"})
        }
   
        if(!(await user.validPassword(password))){
            return done(null,false,{message:"Incorrect Username or Password"});
        }
        return done(null,user);
    })
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user
    res.locals.isLoggedIn=req.isAuthenticated();
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();

})
app.use(methodOverride("_method"));


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex',true);
mongoose.set('useFindAndModify',false);

//Routes//
app.use(indexRoutes);
app.use("/blog",BlogRoutes);
app.use("/follow",followRoutes);
app.use("/profile",profileRoutes);
app.use("/blog/:id/comment",commentRoutes);












//==========================Server Setup=================================================//
app.listen(PORT,Ip,()=>{
    console.log('Blog app has started on Port: '+PORT+'& IP :'+Ip);
})