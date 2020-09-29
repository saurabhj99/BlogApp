const express=require("express");
const router=express.Router(/*{mergerouterams:true}*/);
const multer=require('multer');
const crypto=require('crypto');

const User=require("../models/user");
const Blog=require("../models/blog");
const middleware=require("../middleware/index");


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




router.get("/",middleware.isLoggedIn,(req,res)=>{
    res.render("createprofile");
})

router.post("/:id",middleware.isLoggedIn,upload.single('profile_image'),(req,res)=>{
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

module.exports=router;