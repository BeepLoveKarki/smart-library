$(window).on('load',function(){
	if(localStorage.getItem("todo")==4){
	  $("#issueme").css('display','block');
	}
       localStorage.removeItem("already");
	   localStorage.removeItem("book");
	   $('#modal').modal('show');
	    $('#table #books tr').click(function(){
		   localStorage.setItem("book",$(this).find("#bname").html());
		    $('#table #books tr').css({
			  "background-color":"",
			   "color":""
			});
			$(this).css({
			  "background-color":"#0000CD",
			  "color":"#FFFFFF"
			});
		});
});
function shuffle(){
	  var im=document.getElementById('searchTerm').value.toLowerCase();
	  var b=document.getElementById('books').getElementsByTagName('tr');
	  for(var i=0;i<b.length;i++){
	    var d=b[i].getElementsByTagName('td')[0];
		var e=b[i].getElementsByTagName('td')[1];
		var f=b[i].getElementsByTagName('td')[2];
		if((d.innerHTML.toLowerCase().indexOf(im)>-1)||
		   (e.innerHTML.toLowerCase().replace('<br/>','').indexOf(im)>-1)||
		   (f.innerHTML.toLowerCase().indexOf(im)>-1)){
		     b[i].style.display="";
		}else{
		     b[i].style.display="none";
		}
	  }
}
function fbook(){
  if(localStorage.getItem("todo")!="2"){
	$.get("/checkbg").done(function( data ) {
	         var  r=data.toString();
			 console.log(r);
			 if(r=="Busy"){
			   modal1();
			 }
			 if(r=="Not-Busy"){
			   $.get("/setbg").done(function(data){
			     if(data.toString()=="Ok"){
				   fpp();
				 }
			   });
			 }	 
	});
  }else{
	  fpp();
  }
}
	
function fpp(){
if(localStorage.getItem("book")!==null){
	switch(localStorage.getItem("todo")){
	  case "2":
	      $.post( "/fbook", { book:localStorage.getItem("book")}).done(function( data ) {
	         var  r=$.parseJSON(data);
			 if(r.shelf!="0" && r.desk=="0"){
			   $('.book-loc-b #main-text b').html('The Book "'+localStorage.getItem("book") +'" is currently in Row Numbered '+r.row+' and Column Numbered '+r.col+' of Shelf Numbered '+r.table+'!!! Please find it there!!!');
			 }
			 if(r.shelf=="0" && r.desk!="0"){
			   $('.book-loc-b #main-text b').html('The Book "'+localStorage.getItem("book") +'" is currently found at the submission desk!!! Please find it there!!!');
			 }
			 if(r.shelf!="0" && r.desk!="0"){
			   $('.book-loc-b #main-text b').html('The Book "'+localStorage.getItem("book") +'" is currently found at the submission desk as well as in Row Numbered '+r.row+' and Column Numbered '+r.col+' of Shelf Numbered '+r.table+'!!! Please find it as per your ease!!!');
			 }
			 $('#modal').modal('hide');
			 $('#modal-book-loc').modal('show');
          });
	      break;
	  case "3":
		  postbookreq();
	      break;
	  case "4":
		  window.location.href="/issue";
	      break;
	}
  }else{
    $('#modal').modal('hide');
	$("#tno").html("Please select a book");
	$('#modal-book-noselect').modal('show');
  }
}

function showagain(){
   window.location.reload();
}

function postbookreq(){
	$('#modal').modal('hide');
	$.post("/iinfo",{book:localStorage.getItem("book")}).done(function (data){
		   var r=$.parseJSON(data);
		    if(r.shelf=="0" && r.desk!="0"){
			 $('#modal-desk').modal('show');
		  }else{
	         postbookreq1();
		  }
	  });
}

function postbookreq1(){
$('#modal-book-serve').modal('show');
      $.post("/sbook", { book:localStorage.getItem("book")}).done(function( data ) {
	         var  r=data.toString();
			 if(r=="Served"){
			   modal();
			 }
          });
}

function modal(){
   $('#modal-book-serve').modal('hide');
   $('#modal-book-served').modal('show');
}

function modal1(){
   $('#modal').modal('hide');
   $('#modal-rfbg').modal('show');
}

function d(){
 window.location.href='/';
}

function preselect(){
  $.get("/check7").done(function(data){
	   if(data.toString()=="Yes"){
	     $("#modal-nobook").modal('show');
	   }else{
	      $.get("/checkbg").done(function( data ) {
	         var  r=data.toString();
			 if(r=="Busy"){
			   modal1();
			 }
			 if(r=="Not-Busy"){
			   $.get("/setbg").done(function(data){
			     if(data.toString()=="Ok"){
				   m();
				 }
			   });
			 }	 
	     });
	   }
  });
}

function makebg(){
  $.get("/checkbg").done(function( data ) {
	         var  r=data.toString();
			 console.log(r);
			 if(r=="Busy"){
			   $('#modal-book-loc').modal('hide');
			   modal1();
			 }
			 if(r=="Not-Busy"){
			   $.get("/setbg").done(function(data){
			     if(data.toString()=="Ok"){
				   window.location.href="/issue";
				 }
			   });
			 }	 
	     });
}

function m(){
 localStorage.setItem("already","yes");
 $('#modal').modal('hide');
 $('#modal-already').modal('show');
 $.get("/alreadybook").then(function(data){
   var r=$.parseJSON(data);
   if(r.stat=="Error"){
    window.location.href="/error";
   }
   if(r.stat=="Found"){
	 if(r.shelf!="0" && r.desk!="0"){
	   $('#modal-already').modal('hide');
       $("#modal-book-issueway").modal('show');
	 }
	 if(r.shelf=="0" && r.desk!="0"){
	   issueway(2);
	 }
	 if(r.shelf!="0" && r.desk=="0"){
	   issueway(1);
	 }
   }
   if(r.stat=="No-Match"){
      $('#modal-already').modal('hide');
	  $('#modal-book-rferror').modal('show');
   }
 });
}

function issueway(a){
  $.post("/updatedb",{by:a}).then(function(data){
    if(data.toString()=="Done"){
	   window.location.href="/issue";
	}
  });
}
