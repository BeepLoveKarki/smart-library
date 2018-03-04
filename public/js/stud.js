$(window).on('load',function(){
  $('input').keyup(function(){
    $("#fiel").css('display','none');
  });
  var a=localStorage.getItem("stud");
  if(a===null){
    window.location.href="/";
  }else{
  switch(a){
     case "add":
      $(".add_it").css('display','block');
     break;
     case "edit":
       editor();
     break;
     case "del":
	   editor()
     break;
   }
  }
});


function editor(){
$("#modal").modal('show');
	 $('#table #studs tr').click(function(){
		localStorage.setItem("student",$(this).find("#sname").html());
		localStorage.setItem("roll",$(this).find("#sroll").html());
	   $('#table #studs tr').css({
			  "background-color":"",
			   "color":""
	   });
			$(this).css({
			  "background-color":"#8B0000",
			  "color":"#FFFFFF"
			});
   });
}

function addit(){
 if($('#fname').val().length!='' && $('#roll').val()!=''){
   localStorage.setItem("student",$('#fname').val());
   localStorage.setItem("roll",$('#roll').val());
   $.post('/add_it',{fname:$('#fname').val(),roll:$('#roll').val()}).then(function(data){
    var r=data.toString();
	if(r=="Already"){
	  $('main').css('display','none');
	  $('#modal-book-return').modal('show');
	}
	if(r=="Inserted"){
       	$('main').css('display','none');
	    $("#nobook-heading").html("Entry has been added!!!");
		$('#modal-nobook').modal('show');
	}
 });
 }else{
  $("#fiel").css('display','block');
 }
}

function shuffle(){
	  var im=document.getElementById('searchTerm').value.toLowerCase();
	  var b=document.getElementById('studs').getElementsByTagName('tr');
	  for(var i=0;i<b.length;i++){
	    var d=b[i].getElementsByTagName('td')[0];
		var e=b[i].getElementsByTagName('td')[1];
		if((d.innerHTML.toLowerCase().indexOf(im)>-1)||
		   (e.innerHTML.toLowerCase().indexOf(im)>-1)){
		     b[i].style.display="";
		}else{
		     b[i].style.display="none";
		}
	  }
}

function update(){
  $.post("/aedits",{name:localStorage.getItem("student"),roll:localStorage.getItem("roll")}).done(function(data){
   if(data.toString()=="Done"){
     $("#modal-book-return").modal('hide');
	 $("#nobook-heading").html("Entry has been edited!!!"); 
	 edited();
   }
  });
}

function editit(){
 $.post("/edits",{n:$("#f_edit_name").val(),r:$("#edit_roll").val(),previous:localStorage.getItem("roll")}).then(function(data){
    if(data.toString()=="Done"){
	  $("#nobook-heading").html("Entry has been edited!!!");
	  edited();
	}
 });
}

function edited(){
      $('main').css('display','none');
	  $('#modal-nobook').modal('show');
}

function fstud(){
   $("#modal").modal('hide');
   if(localStorage.getItem("student")!=null && localStorage.getItem("roll")!=null){ 
   if(localStorage.getItem("stud")=="edit"){
	 $('#f_edit_name').val(localStorage.getItem("student"));
     $('#edit_roll').val(localStorage.getItem("roll"));
     $(".edit_it").css('display','block');
   }
   if(localStorage.getItem("stud")=="del"){
     $.post("/edelete",{roll:localStorage.getItem("roll")}).then(function(data){
	   if(data.toString()=="Done"){
	     $("#nobook-heading").html("Entry has been deleted!!!");
         edited(); 
	   }
	 });
   }
   }else{
     $("#modal-desk").modal('show');
   }
}

function showagain(){
   $("#modal-book-noselect").modal('hide');
   editor();
}