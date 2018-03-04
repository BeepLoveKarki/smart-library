$(window).on('load',function(){
  if(parseInt($("#famt").val())==0){
    $("#modal-nfine").modal('show');
  }else{
    $("#modal-fine").modal('show');
  }
});

function clearfine(){
 $.get("/clearf").then(function(data){
	 if(data.toString()=="Done"){
	   $("#modal-fine").modal('hide');
	   $("#nfine-heading").html("Your fine has been cleared!!!");
	   $("#modal-nfine").modal('show');
	 }
 });
}