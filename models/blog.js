const mongoose=require("mongoose");
const blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    content:String,
    created:{type:Date,default:Date.now},
    author:{ id:{type:mongoose.Schema.Types.ObjectId,
             ref:"User"
        },
      username:String,
      profile_pic:String
    
    },
    comments:[{type:mongoose.Schema.Types.ObjectId,
              ref:'Comment'}]
    
})
module.exports=mongoose.model('Blog',blogSchema);