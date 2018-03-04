$(window).on('load',function(){
 $('#modal-trans').modal('show');
});

function out(){
		$.ajax({url:'/logout'}).done(function (data) {
				  if(data==="Done"){
					localStorage.setItem("loggedin","-1");
				    window.location.replace("/static/main/login");
				  }else{
				     window.location.href="/static/main/error";
				  }
          });
}
if(document.referrer.endsWith("/")){
  setTimeout(window.history.forward(),0);
}