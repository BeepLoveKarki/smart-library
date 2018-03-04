var m;
$(window).on('load',function(){
	   localStorage.removeItem("book");
      if($('#table #books').html().length <=24){
         $('#modal-nobook').modal('show');	     
	   }else{
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
	   }   
});

function returnbook(){
   postbookrreq();
}

function renewbook(){
   $("#modal-what").modal('hide');
   $("#modal-book-l").modal('show');
   $.post('/bookrenew',{book:localStorage.getItem("book")}).done(function(data){
	if(data.toString()=="Error"){
	  window.location.href="/error";
	}
	if(data.toString()=="renewed"){
	  $("#modal-book-l").modal('hide');
	  $("#returned-h").html("Your book has been successfully renewed for next three months");
	  $('#modal-book-returned').modal('show');
	}
	if(data.toString()=="Not-Matched"){
	  nmatch();
	}
   });
}

function postbookrreq(){	
	  $("#modal-what").modal('hide');
	  $("#modal-book-l").modal("show");
	  checktag();
}

function checktag(){
  $.post('/checkrtag',{book:localStorage.getItem("book")}).done(function(data){
	  var r=$.parseJSON(data);
	if(r.status=="Error"){
	  window.location.href="/error";
	}
    if(r.status=="Matched"){
	   startserving();
	}
	if(r.status=="Not-Matched"){
	  nmatch();    
	}
  });
}

function nmatch(){
   $("#modal-book-ibreturn").modal('hide');
   $("#modal-book-rferror").modal('show');
}

function finalize(){
    window.location.href="/";
}

function startserving(){
   $.post('/ibreturn',{book:localStorage.getItem("book")}).done(function(data){
      var r=data.toString();
	  if(r=="IbReturned"){
		 $("#modal-book-l").modal("hide");
		 $("#returnself-h").html("Your Book has been returned successfully!!! Please Place the book over the submission desk!!!");
		 $("#modal-book-returnself").modal("show");
	  }
   });
}

function shuffle(){
	  var im=document.getElementById('searchTerm').value.toLowerCase();
	  var b=document.getElementById('books').getElementsByTagName('tr');
	  for(var i=0;i<b.length;i++){
	    var d=b[i].getElementsByTagName('td')[0];
		var e=b[i].getElementsByTagName('td')[1];
		var f=b[i].getElementsByTagName('td')[2];
		if((d.innerHTML.toLowerCase().indexOf(im)>-1)||
		   (e.innerHTML.toLowerCase().indexOf(im)>-1)||
		   (f.innerHTML.toLowerCase().indexOf(im)>-1)){
		     b[i].style.display="";
		}else{
		     b[i].style.display="none";
		}
	  }
}


function rbook(){
 $.get("/checkbg").done(function( data ) {
	         var  r=data.toString();
			 if(r=="Busy"){
			   modal1();
			 }
			 if(r=="Not-Busy"){
			   $.get("/setbg").done(function(data){
			     if(data.toString()=="Ok"){
				   if(localStorage.getItem("book")!==null){
                       $('#modal').modal('hide');
                       $('#modal-what').modal('show');
                    }else{
                        $('#modal').modal('hide');
                        $('#modal-book-noselect').modal('show');
                   }
				 }
			   });
			 }	 
	});

}

function showagain(){
   window.location.reload();
}

function modal1(){
   $('#modal').modal('hide');
   $('#modal-rfbg').modal('show');
}