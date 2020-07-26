
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

  // success case
 

  
  xhr.open ("POST", "/follow", true);
  xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
 
  xhr.send("follower="+data.follower+"&following="+data.following+"&action="+data.action);
  return false;
}


