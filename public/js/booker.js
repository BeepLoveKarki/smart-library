var b=new Array();
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
	case "del":
	  $("main").css("display","none");
	  editor();
	break;
	case "edit":
	  $("main").css("display","none");
	  editor();
	break;
   }
 }
});

function editor(){
$("#modal").modal('show');
	 $('#table #books tr').click(function(){
		b=new Array();
		localStorage.setItem("bname",$(this).find("#bname").html());
		var a=$(this).find("#writer").html().replace(/\t/g,"").replace(/\n/g,"").replace(" ","").trim().split('<br>');
		var a1=a.filter(function(x){
		  return (x!==(undefined||null||''));
		});
		for(var i=0;i<a1.length;i++){
		  b.push(a1[i].trim());
		}
		b=b.join(",");
		localStorage.setItem("bwriter",b);
		localStorage.setItem("bpublication",$(this).find("#publication").html());
	   $('#table #books tr').css({
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
  var a= new Array();
  a.push($('#biname').val(),$('#wname').val(),$('#pname').val(),$('#rtag').val().toString(),$('#loc_shelf').val().toString(),$('#loc_shelf_row').val().toString(),$('#loc_shelf_col').val().toString(),$("#ntag").val().toString());
  console.log(a);
  if(a.includes("")){
    $("#fiel").css('display','block');
  }else{
  a.forEach(function(item,index){
	  localStorage.setItem("d"+index,item);
  });
	  $.post('/addbook_it',JSON.stringify(a)).then(function(data){
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
 }
}

function update(){
  $.post("/aebookedits",JSON.stringify(a)).done(function(data){
   if(data.toString()=="Done"){
     $("#modal-book-return").modal('hide');
	 $("#nobook-heading").html("Entry has been edited!!!"); 
	 edited();
   }
  });
}

function edited(){
      $('main').css('display','none');
	  $('#modal-nobook').modal('show');
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

function fbook(){
if(localStorage.getItem("bname")==null){
 $("#modal").modal("hide");
 $("#modal-book-noselect").modal("show");
}else{
if(localStorage.getItem("stud")=="del"){
 $.post("/bookdel",{book:localStorage.getItem("bname"),writer:localStorage.getItem("bwriter"),publication:localStorage.getItem("bpublication")}).then(function(data){
   if(data.toString()=="Done"){
	  $("#modal").modal("hide");
     $("#nobook-heading").html("Entry has been deleted!!!"); 
	 edited();
   }
 });
}
if(localStorage.getItem("stud")=="edit"){
	$.post("/getdatas",{bname:localStorage.getItem("bname"),bwriter:localStorage.getItem("bwriter"),bpublication:localStorage.getItem("bpublication")}).then(function(data){
      var r=$.parseJSON(data);
      $("#beditname").val(localStorage.getItem("bname"));
      $("#weditname").val(localStorage.getItem("bwriter"));
      $("#peditname").val(localStorage.getItem("bpublication"));
      $("#rtagedit").val(r["tag"]);
      $("#loc_shelfedit").val(r["shelf"]);
      $("#loc_shelf_rowedit").val(r["row"]);
	  $("#loc_shelf_coledit").val(r["col"]);	
      $("#ntagedit").val(r["num"]);
	  $("#statedit").val(r["stat"]);
      $("#nshelftagedit").val(r["numshelf"]);
      $("#ndesktagedit").val(r["numdesk"]);	  
	  $("#modal").modal("hide");
	  $('main').css('display','block');
	  $(".edit_it").css("display","block");
	});
}
}
}

function editit(){
  var a=new Array();
  a.push($("#beditname").val(),$("#weditname").val(),$("#peditname").val(),$("#rtagedit").val(),$("#loc_shelfedit").val(),$("#loc_shelf_rowedit").val(),
        $("#loc_shelf_coledit").val(),$("#statedit").val(),$("#ntagedit").val(),$("#nshelftagedit").val(),$("#ndesktagedit").val(),localStorage.getItem("bname"),localStorage.getItem("bwriter"),localStorage.getItem("bpublication"));
  $.post("/newedits",JSON.stringify(a)).then(function(data){
   if(data.toString()=="Done"){
      $("#nobook-heading").html("Entry has been edited!!!"); 
	  edited();
   }
  });
}