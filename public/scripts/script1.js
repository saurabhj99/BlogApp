var UploadImageFormData=new FormData();
var imageUrl="";

function uploadfile(){
document.getElementById('img').click();
}

function UploadBlogImage(){
  const input_btn=document.getElementById('img');
  const div=document.getElementById('filename2');
  div.textContent="Filename: "+input_btn.value.split(/(\\|\/)/g).pop();
  div.style.padding="5px ";

}

//Handles Image Uploading 
function uploadProfile(url){
  const profile_pic=document.getElementById('profile_upload');
  const fileName=document.getElementById('filename')
  imageUrl=url;

  profile_pic.addEventListener('click',()=>{
    //create a submit button
    const submit_btn=document.createElement("button");
    submit_btn.id="up_image";
    submit_btn.innerHTML="Upload Image";
    submit_btn.onclick=PostImage
    
    //create a input type=file button
    const inp=document.createElement("input");
    inp.name="profile_image";
    inp.type="file";
    inp.accept="image/*";
    inp.required=true;
    inp.id="pfpic";
    inp.hidden=true;
    const uploadBtn=document.getElementById('pfpic');
    if(!uploadBtn){
      document.getElementById('user_profile_pic').appendChild(inp); 
    } 
    inp.click();
    inp.addEventListener('change',()=>{
      UploadImageFormData.append("profile_image", inp.files[0],inp.files[0].filename);
      document.getElementById('user_profile_pic').appendChild(submit_btn);
      fileName.innerHTML="Filename: "+inp.value.split(/(\\|\/)/g).pop();
      fileName.style.padding="4px";
    })
  
  })
}
//Handles Posting of form
function PostImage(){
  var xhr=new XMLHttpRequest();
  xhr.onload = function() {
     location.reload();
  };

  xhr.open("POST", imageUrl, true);
  xhr.send(UploadImageFormData);

}


function postComment(FormElement){
  var xhr = new XMLHttpRequest();
  xhr.open (FormElement.method, FormElement.action, true);
  var formData = new FormData(FormElement)
  xhr.send (formData);
  return false;
}

function follows(id){
  var xhr = new XMLHttpRequest();
  const btn=document.getElementById(id)
  const data=document.getElementById(id).dataset;
  console.log(data.action)
  var classes=btn.className.split();
  if(classes[0]==="unfollowed"){
  btn.classList.remove("unfollowed");
  btn.classList.add('followed');
  data.action="Follow";
  }else{
    btn.classList.remove("followed");
    btn.classList.add("unfollowed");
    data.action="Unfollow"
    
  }
  // success case
  xhr.open ("POST", "/follow", true);
  xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
  xhr.send("follower="+data.follower+"&following="+data.following+"&action="+data.action);
  return false;
}


function show(){
const input=document.getElementById('pswd');
if(input.type==="password"){
  input.type="text"
}else{
  input.type="password"
}
}

function changestatus(){
  const container=document.getElementById("user_info");
  const edit_btn=document.getElementById("Edit_btn");
  const save_Btn=document.getElementById("save_Btn");
  edit_btn.style.display="none";
  save_Btn.style.display="inline";
    const input_fields=container.querySelectorAll("input[type='text']")
    input_fields.forEach((input_field)=>{
     
      input_field.classList.remove("onlyReadable","notallowed");
      input_field.readOnly=false;
      
  })
}

function navbarHandler(){
  const link=document.getElementsByClassName('navlinks')[0];
  setTimeout(()=>link.classList.toggle('active'),300);
}

