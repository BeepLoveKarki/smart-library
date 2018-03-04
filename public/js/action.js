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


$(window).on('load',function(){
  $.get('/danger').then(function(data){
      var a=data.toString();
	  if(a=="yes"){
		$('main').css('display','none');
        $("#modal-danger").modal('show');	  
	  }
  });
  localStorage.removeItem("book");
  localStorage.setItem("loggedin","1");
  checklogin();
  foo();
});


if(document.referrer.endsWith("login")||document.referrer.endsWith("/")){  
  setTimeout(window.history.forward(),0);
}

function regain(){
  $('main').css('display','block');
}

function foo() {
	$.get("/notify").then(function(data){
	   var r=$.parseJSON(data);
	   var a=r.book.toString();
	    if(r.status=="Arrived"){
			 toastr.info('New book responses have arrived!!! Please check out!!!');     
		}
		if(r.status=="Arrived"||r.status=="Arrived1"){ 
		   $('#response').css('margin-top','-15px');
		   $('#response').html("<i>The book(s) similar to your previous request/s <b>"+a+"</b> have been  found or arrived in library!!! Please look at the updated database!!!</i>");	    
		   setTimeout(foo(),10000);
		}
	});
}

function restore(){
  window.location.href="/";
}

function a(i){
	 localStorage.setItem("todo",i);
	 switch(i){
	  case "1":
	    $('main').css('display','none');
	    $('#modal-req').modal('show');
	    break;
	  case "2":
	     window.location.href="/book-list";
	     break;
	  case "3":
	     window.location.href="/payfine";
	     break;
	  case "4":
	      window.location.href="/book-list";
	      break;
	  case "5":
	      window.location.href="/return";
	      break;
	  case "6":
	     $('main').css('display','none');
	     $('#modal-feedback').modal('show');
	     break;
	 }
}

function sendreq(){
   $('#modal-req').modal('hide');
   $('#modal-req-form').modal('show');
}

function okdone(){
	if($('#reqbookname').val().length!=0){
      $.post("/reqbook",{bname:$('#reqbookname').val(),aname:$('#reqbookauthname').val(),pname:$('#reqbookpubname').val()}).then(function(data){
	    var r=data.toString();
		if(r=="Done"){
		  $('#modal-req-form').modal('hide');
		  $('#modal-req-done').modal('show');
		}
	  });
  }else{
   $('#reqbookname').focus();
   $('#reqbookname').attr('placeholder','Please at least enter a book name to request');
  }
}
