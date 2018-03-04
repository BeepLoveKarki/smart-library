$(window).on('load',function(){
	if(localStorage.getItem("already")=="yes"){
	   $('#issued-h').html("The book has been issued");
	   $('#modal-book-issued').modal('show');
	}else{
	 $.get("/check7").done(function(data){
	   if(data.toString()=="Yes"){
	     $("#modal-nobook").modal('show');
	   }else{
	     postbookireq();
	   }
	 });
	}
});

function postbookireq(){
	  $.post("/iinfo",{book:localStorage.getItem("book")}).done(function (data){
		 var r=$.parseJSON(data);
		 $('#modal-book-issue').modal('hide');
	     $('#modal-book-issueself').modal('show');
		  if(r.shelf!="0" && r.desk=="0"){
			 $('#issueself-b b').html('The Book "'+localStorage.getItem("book") +'" is currently in Row Numbered '+r.row+' and Column Numbered '+r.col+' of Shelf Numbered '+r.table+'!!!  Please find it there and show it to the rfid reader by the Counter Desk!!!');
		     be("shelf");
		  }
		  if(r.shelf=="0" && r.desk!="0"){
			 $('#issueself-b b').html('The Book "'+localStorage.getItem("book") +'" is currently found at the submission desk!!!  Please find it there and show it to the rfid reader by the Counter Desk!!!');
		     be("desk");
		  }
		  if(r.shelf!="0" && r.desk!="0"){
			 $('#issueself-b b').html('The Book "'+localStorage.getItem("book") +'" is currently found at the submission desk as well as in Row Numbered '+r.row+' and Column Numbered '+r.col+' of Shelf Numbered '+r.table+'!!!  Please find it at your ease and show it to the rfid reader by the Counter Desk!!!');
		     be("any");
		  }
	  });
	
      
}

function be(b){
	  $.post("/ibook", { book:localStorage.getItem("book")}).done(function( data ) {
	         var  r=data.toString();
			 if(r=="IsServed"){
			   modal(b);
			 }
          });
}

function restart(){
  window.location.href="/";
}

function modal(b){
   $.post("/checkrfissue",{way:b}).done(function(data){
	  var r=data.toString();
	  if(r==="Issued"){
	   $('#modal-book-issueself').modal('hide');
	   $('#issued-h').html("The book has been issued");
	   $('#modal-book-issued').modal('show');
	  }
	  if(r==="No-Match"){
		 $('#modal-book-issueself').modal('hide');
	     $('#modal-book-rferror').modal('show');
	  }
	  if(r==="Error"){
	   window.location.href="/error";
	  }
	  if(r=="how"){
	     $('#modal-book-issueself').modal('hide');
		 $('#modal-book-issueway').modal('show');
	  }
   });
}

function issueway(b){
 $.post("/issueway",{way:b}).done(function(data){
   if(data.toString()=="Issued"){
	 $('#modal-book-issueway').modal('hide');
     $('#issued-h').html("The book has been issued");
	 $('#modal-book-issued').modal('show');
   }
 });
}