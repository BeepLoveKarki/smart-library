function out(){
		$.ajax({url:'/logout-admin'}).done(function (data) {
				  if(data==="Done"){
					localStorage.setItem("loggedin-admin","-1");
				    window.location.replace("/static/main/login");
				  }else{
				     window.location.href="/static/main/error";
				  }
          });
}
if(document.referrer.endsWith("/")){
  setTimeout(window.history.forward(),0);
}

$(window).on('load',function(){
  localStorage.clear();
  localStorage.setItem("loggedin-admin","1");
  checklogin1();
});

function doit(a){
   switch(a){
    case '1':
	 window.location.href="/manage";
	break;
	case '2':
	 $('main').css('display','none');
	 $("#modal-admin-change").modal('show');
	break;
	case '3':
	  localStorage.setItem("what","student");
	  $('.nohead').css('display','none');
	  $('#modal-editb').modal('show');
	break;
	case '4':
	   localStorage.setItem("what","book");
	  $('.nohead').css('display','none');
	  $('#modal-editb').modal('show');
	break;
	case '5':
	  window.location.href="/view-req";
	break;
	case '6':
	  window.location.href="/view-feed";
	break;
   }
}

function addjumb(){
 localStorage.setItem("stud","add");
 takeme();
}
function deljumb(){
 localStorage.setItem("stud","del");
 takeme();
}
function edjumb(){
 localStorage.setItem("stud","edit");
 takeme();
}

function takeme(){
if(localStorage.getItem("what")=="student"){
  window.location.href="/stud";
 }
 if(localStorage.getItem("what")=="book"){
   window.location.href="/booker";
 }
}