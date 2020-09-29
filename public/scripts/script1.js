
function postComment(FormElement)
{
  var xhr = new XMLHttpRequest();
  xhr.onload = function(){ alert (xhr.responseText); } // success case
  xhr.onerror = function(){ alert (xhr.responseText); } // failure case
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