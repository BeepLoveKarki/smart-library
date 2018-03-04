var arr=new Array();
$(window).on('load',function(){
  $("#modal").modal('show');
    $('#table #books tr').addClass("nocol");
  $('#table #books tr').click(function(){
	var a=$(this).attr('class');
	if(a=="nocol"){
	 arr.push($(this).find("#bname").html());
	 $(this).removeClass("nocol");
	 $(this).addClass("col");
	}else{
	 arr.splice(arr.indexOf($(this).find("#bname").html()),1);
	 $(this).removeClass("col");
	 $(this).addClass("nocol");
	}
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
 $.post("/mbook",JSON.stringify(arr)).then(function(data){
  if(data.toString()=="Done"){
    window.location.reload();
  }
 });
}
