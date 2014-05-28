var extRef = new Firebase('https://incandescent-fire-5345.firebaseio.com/');
var auth = new FirebaseSimpleLogin(extRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
    switch(error.code) {
      case 'INVALID_PASSWORD': document.getElementById("errmsg").innerHTML = "The password is incorrect.";
            break;
      case 'INVALID_EMAIL': document.getElementById("errmsg").innerHTML = "The email address is incorrect."
            break;
      default: document.getElementById("errmsg").innerHTML = error.code;
    }    
  } else if (user) {
    // user authenticated with Firebase
    console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
    console.log('logged in');
    console.log(user);
    $("#emailbox").hide();
    $("#passwordbox").hide();
    $("#CreateUser").hide();
    $("#Login").hide();
    $("#Logout").show();
    $("#em").hide();
    $("#pa").hide();
    document.getElementById("Profile").innerHTML = 'You have logged in as: '+user.email;
    document.getElementById("errmsg").innerHTML = '';
  } else {
    // user is logged out
    $("#emailbox").show();
    $("#passwordbox").show();
    $("#CreateUser").show();
    $("#Login").show();
    $("#Logout").hide();
    $("#em").show();
    $("#pa").show();
    document.getElementById("Profile").innerHTML = '';
    document.getElementById("errmsg").innerHTML = '';
    console.log('logged out');
  }
});


$("#CreateUser").click(function(){
  if ($("#emailbox").val()===""){
    document.getElementById("errmsg").innerHTML = "Please enter your email address.";
  }
  else if ($("#passwordbox").val()===""){
    document.getElementById("errmsg").innerHTML = "Please enter password.";
  }
  else {
    auth.createUser($("#emailbox").val(), $("#passwordbox").val(), function(error, user) {
      if (!error) {
        console.log('User Id: ' + user.uid + ', Email: ' + user.email);
        document.getElementById("errmsg").innerHTML = "User created as:"+'User Id: ' + user.uid + ', Email: ' + user.email;
        alert('User "'+ user.email + '" created');
      }
      else {
        console.log(error);
        switch(error.code) {
          case 'EMAIL_TAKEN': document.getElementById("errmsg").innerHTML = "The email address is already in use.";
                break;
          case 'INVALID_EMAIL': document.getElementById("errmsg").innerHTML = "The email address is not a valid email address."
                break;
          default: document.getElementById("errmsg").innerHTML = error.code;
        }
      }
    });
  }
});

$("#Login").click(function(){
  if ($("#emailbox").val()===""){
    document.getElementById("errmsg").innerHTML = "Please enter your email address.";
  }
  else if ($("#passwordbox").val()===""){
    document.getElementById("errmsg").innerHTML = "Please enter password.";
  }
  else {
    auth.login('password', {
        email: $("#emailbox").val(),
        password: $("#passwordbox").val()
    });
  }
});

$("#Logout").click(function(){
  auth.logout();
});          