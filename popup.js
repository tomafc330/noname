var extRef = new Firebase('https://incandescent-fire-5345.firebaseio.com/');
var auth = new FirebaseSimpleLogin(extRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
    alert('Error!');
  } else if (user) {
    // user authenticated with Firebase
    console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
    console.log('logged in');
    console.log(user);
    alert('Logged in as '+ user.email);
  } else {
    // user is logged out
    console.log('logged out');
    alert('Logged out.');
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
        alert('Error!');
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