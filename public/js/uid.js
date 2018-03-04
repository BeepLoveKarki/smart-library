$(window).on('load',function(){
  $("#modal-admin").modal('show');
});

$(document).keypress(function(e) {
    if(e.which == 13) {
        e.preventDefault();
    }
});
function seepass(){
  $.post('/uidlog',{adpass:$("#adpass").val().toString()}).then(function(data){
	if(data.toString()=="True"){
	  $("#modal-admin").modal('hide');
	  $("#modal-uid").modal('show');
	}
	if(data.toString()=="False"){
	 window.location.href="/wrong";
	}
  });
}

function getuid(){
 $.post('/getuid',{user:$("#username").val().toString()}).then(function(data){
  var r=data.toString();
  if(r=="No"){
   $("#uidr").html("No such user found!!!");
  }else{
   $("#uidr").html("The UID for the username is "+r+"!!!");
  }
 });
}