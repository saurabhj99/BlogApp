const mongoose=require("mongoose");
const blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    content:String,
    created:{type:Date,default:Date.now},
    author:{ username:String,
             full_name:String,
             profile_pic:String,
             id:{type:mongoose.Schema.Types.ObjectId,
                 ref:"User"},
      
    
    },
    comments:[{type:mongoose.Schema.Types.ObjectId,
              ref:'Comment'}]
    
})
module.exports=mongoose.model('Blog',blogSchema);