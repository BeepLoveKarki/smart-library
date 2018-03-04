function checklogin() {
  if(localStorage.getItem("loggedin")=="-1"||localStorage.getItem("loggedin")==null) {
    window.location.replace('/');
  }
}

function checklogin1() {
  if(localStorage.getItem("loggedin-admin")=="-1"||localStorage.getItem("loggedin-admin")==null) {
    window.location.replace('/');
  }
}

