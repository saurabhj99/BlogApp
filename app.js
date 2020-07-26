const express=require("express");
const app=express();
const path=require('path');
const bodyParser=require('body-parser');
const methodOverride=require("method-override");
const mongoose=require('mongoose');
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');
const session=require('express-session');
const flash=require("connect-flash");
const multer=require('multer');
const crypto=require('crypto');
app.use('/profile', express.static('uploads'));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname+'/uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, crypto.createHash('sha256').update(Date.now().toString()).digest('hex') )
    }
  })

  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
const upload = multer({ storage: storage,
    limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter })

const Blog=require('./models/blog');
const User=require('./models/user');
const Comment=require('./models/comment');
const middleware=require("./middleware/index");
const PORT=process.env.PORT ||5000;
const Ip=process.env.IP ||'0.0.0.0';
const url =process.env.DATABASEURL||"mongodb://localhost:27017/Daily_mail";

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());

app.use(session({
    secret:'Secret',
    resave:false,
    saveUninitialized:false

}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
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



//==============================Landing Page=================================================//
app.get("/",(req,res)=>{
    Blog.find({},(err,Blogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('home',{Blogs:Blogs});
        }
    })
    
})
//=======================================================================================//


app.get("/login",(req,res)=>{
    res.render('login');
})
app.post("/login",passport.authenticate("local",{successRedirect:"/",failureRedirect:"/login"}),(req,res)=>{
})

app.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect('/');
})


app.get("/register",(req,res)=>{
    res.render('register');
})

app.post('/register',(req,res)=>{
    const user={email:req.body.email,username:req.body.username};
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
//==================================Create Blog=========================================//
app.get("/create",middleware.isLoggedIn,(req,res)=>{
    
    res.render('createblog')
    
})

app.post("/create",middleware.isLoggedIn,(req,res)=>{
    const title=req.body.title;
    const image=req.body.image;
    const content=req.body.content;
    const author={id:req.user._id,
        username:req.user.username,profile_pic:req.user.profile_pic};
    const newblog={title:title,image:image,content:content,author:author};
    
    Blog.create(newblog,(err,newBlog)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/");
        }
    })
})
//========================================================================================//


//=======================================Show Blog========================================//
app.get("/blog/:id",(req,res)=>{
    Blog.findById(req.params.id).populate('comments').exec((err,Blog)=>{
        if(err){
            res.redirect('/');
        }else{
            res.render('blog',{Blog:Blog});
        }

    })
})
//=========================================================================================//
//======================================Edit blog==========================================//
app.get("/blog/:id/edit",middleware.checkBlogOwnership,(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
           if(err){
               console.log(err);
           }else{
            res.render('editblog',{foundBlog:foundBlog});
           }
    })
    

})
app.put("/blog/:id/edit",middleware.checkBlogOwnership,(req,res)=>{
    const blog={title:req.body.title,image:req.body.image,content:req.body.content};
    Blog.findByIdAndUpdate(req.params.id,blog,(err,updatedBlog)=>{
        if(err){
            res.redirect("/");
        }
        else{
            res.redirect("/blog/"+req.params.id);
        }
    })
})
//=========================================================================================//
//====================================Comments Route=======================================//
app.get("/blog/:id/comment",middleware.isLoggedIn,(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){ console.log(err);}
        else{
            res.render('addcomment',{foundBlog:foundBlog});
        }
    })
    
})
app.post("/blog/:id/comment",middleware.isLoggedIn,(req,res)=>{
    Blog.findById(req.params.id,(err,foundblog)=>{
        if(err){
            console.log(err);
        }else{
            Comment.create({text:req.body.text},(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    foundblog.comments.push(comment);
                    foundblog.save();
                    res.redirect("/blog/"+ foundblog._id);
                }
            })
        }
    })
})
app.get("/blog/:id/comment/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
            if(err||!foundBlog){
                req.flash("error","No Blog find");
                res.redirect("back");
            }
           
    Comment.findById(req.params.comment_id,(err,foundComment)=>{
        if(err){ console.log(err);}
        else{
            res.render('editcomment',{blog_id:req.params.id,comment:foundComment});
        }
    })
})
})
app.put("/blog/:id/comment/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id,{text:req.body.text,created:Date.now()},(err,updatedcomment)=>{
        if(err){
            res.redirect("/");
        }
        else{
            res.redirect("/blog/"+req.params.id);
        }
    })
})
app.delete("/blog/:id/comment/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
 Comment.findByIdAndRemove(req.params.comment_id,(err,foundcomment)=>{
      if(err){
          console.log(err);
      }
      else{
          Blog.updateOne( {_id:req.params.id},{ $pull: {comments:req.params.comment_id} },(err,Blogfound)=>{
              if(err){
                  console.log(err);
              }
              else{
                  console.log(Blogfound);
                res.redirect('/blog/'+req.params.id);
              }
          })
          
      }
 })
})

app.get("/profile",middleware.isLoggedIn,(req,res)=>{
    res.render("createprofile");
})

app.post("/profile/:id",middleware.isLoggedIn,upload.single('profile_image'),(req,res)=>{
    const file=req.file;
    
    console.log(file)
    User.findByIdAndUpdate(req.params.id,{username:req.body.username,about:req.body.about,twitac:req.body.twitter,profile_pic:file.filename},(err,founduser)=>{
        if(err){
            console.log(err);
        }else{
        Blog.updateMany({"author.id":{$eq:req.params.id}},{author:{profile_pic:file.filename}},(err,foundBlog)=>{
            if(err){
            console.log(err);
            }else{
                console.log(foundBlog.author);
            res.redirect("/");
            }

        })
         
        }
    })
})
app.post("/follow",async(req,res,next)=>{
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
//==========================================================================================//
app.listen(PORT,Ip,()=>{
    console.log('Blog app has started on Port: '+PORT+'& IP :'+Ip);
})