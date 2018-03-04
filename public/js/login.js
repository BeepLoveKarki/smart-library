setTimeout(window.history.forward(),0);

function cookies(){
  localStorage.setItem("loggedin")="1";
}

function openmodal(){
  $('.wraploginwrap').css('display','none');
  $('#modal-admin').modal('show');
}

$(window).on('load',function(){
  localStorage.removeItem("todo");
});