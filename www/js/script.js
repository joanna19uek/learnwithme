function goToSite(id){  
  //window.location.href+='#' + id;
  var anch = document.createElement('a');
  
  anch.setAttribute("href", "#"+id);
  anch.click();

}
/*

var googleSignin = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
   firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ..
  console.log(user);
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...

});
}

var googleSignout = function() {
   firebase.auth().signOut()
	
   .then(function() {
      console.log('Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')  
   });
}
*/
(function() {
	// Initialize Firebase
  var config = {
    apiKey: "AIzaSyC2E9hI9X2e2KCHyEiaz5vcaFXOFvY0HQc",
    authDomain: "learnwithme-98129.firebaseapp.com",
    databaseURL: "https://learnwithme-98129.firebaseio.com",
    projectId: "learnwithme-98129",
    storageBucket: "learnwithme-98129.appspot.com",
    messagingSenderId: "1032899670271"
  };
  firebase.initializeApp(config);

  

}());
$(document).ready(function(){
  const emailInput = document.getElementById('email');
  const passInput = document.getElementById('haslo');
  const btnLogIn = document.getElementById('zaloguj');
  const btnGLogIn = document.getElementById("zalogujG");
  const btnFBLogIn = document.getElementById("zalogujFB");
  const btnRegis = document.getElementById("zarejestruj");
  const logout = document.getElementById("wyloguj");

  //EVENT LISTENER DO LOGOWANIA
  btnLogIn.addEventListener('click', function() {
  	//Pobranie email i hasła
  	const email = emailInput.value;
  	const passwd = passInput.value;
  	const auth = firebase.auth();
  	//Logowanie
  	const promise = auth.signInWithEmailAndPassword(email, passwd);
  	var info = document.getElementById('logInfo');
  	info.style.color = "red";
  	promise.catch(e => {
  		//console.log(e.message);
  		console.log(e.code);
  		switch (e.code){
  				case "auth/invalid-email":
  					info.innerText = "Niepoprawny email!";
  					emailInput.style.border = "3px solid #ff7777";  					
  					console.log(e.code);
  					break;
  				case "auth/user-not-found":
  					info.innerText = "Niepoprawny email!";
  					emailInput.style.border = "3px solid #ff7777";  					
  					console.log(e.code);
  					break;  				
  				case "auth/email-already-in-use":
  					info.innerText = "Email jest już w użyciu!";
  					emailInput.style.border = "3px solid #ff7777";  
  					console.log(e.code);
  					break;
  				case "auth/wrong-password":
  					info.innerText = "Niepoprawne hasło!"
  					passInput.style.border = "3px solid #ff7777";
  					console.log(e.code);
  					break;
  				default:
    				info.innerText = "Nieokreślony błąd.";
    				console.log(e.code);
    				break;
  			}
  	});
  	info.innerText = "";
  	passInput.style.border = "0px solid #ff7777";
  	emailInput.style.border = "0px solid #ff7777";
  	
  });

  //EVENT LISTENER DO REJESTRACJI
  btnRegis.addEventListener('click', function() {
    const nickReg = document.getElementById('nickreg').value;
  	//Pobranie email i hasła
  	const emailRegInput = document.getElementById('emailreg');
  	const emailReg = emailRegInput.value;
  	const passwdReg1Input = document.getElementById('hasloreg');
  	const passwdReg1 = passwdReg1Input.value;
  	const passwdReg2Input = document.getElementById('haslopowtreg');
  	const passwdReg2 = passwdReg2Input.value;
  	var info = document.getElementById('regInfo');
  	info.style.color = "red";
  	if(passwdReg1 === passwdReg2){
  		const auth = firebase.auth();
  		//Logowanie
  		const promise = auth.createUserWithEmailAndPassword(emailReg, passwdReg1);
  		promise.catch(e => {
  			switch (e.code){
  				case "auth/invalid-email":
  					info.innerText = "Niepoprawny email!";
  					emailRegInput.style.border = "3px solid #ff7777";
  					console.log(e.code);  
  					break;
  				case "auth/weak-password":
  					info.innerText = "Hasło musi zawierać co najlniej 6 znaków!";
  					passwdReg1Input.style.border = "3px solid #ff7777"; 
  					passwdReg2Input.style.border = "3px solid #ff7777"; 
  					console.log(e.code);
  					break;
  				case "auth/email-already-in-use":
  					info.innerText = "Email jest już w użyciu!";
  					emailRegInput.style.border = "3px solid #ff7777"; 
  					passwdReg1Input.style.border = "0px solid #ff7777"; 
	  				passwdReg2Input.style.border = "0px solid #ff7777";
  					console.log(e.code);
  					break;
  				default:
    				info.innerText = "Nieokreślony błąd.";
    				console.log(e.code);
    				break;
  			}  			
  		});
  		promise.then(function(){
	  		info.innerText = "";
	  		emailRegInput.style.border = "0px solid #ff7777";
	  		passwdReg1Input.style.border = "0px solid #ff7777"; 
	  		passwdReg2Input.style.border = "0px solid #ff7777"; 
        addUserToDB(emailReg, nickReg, firebase.auth().currentUser.uid)
	  		goToSite('afterRegPage');
  		});

  	}else{
  		console.log("Hasła są niepoprawne");
  		info.innerText = "Hasła nie są identyczne!";  	
  		passwdReg1Input.style.border = "3px solid #ff7777"; 
  		passwdReg2Input.style.border = "3px solid #ff7777"; 	
  	}

  	
  });

  //EVENT LISTENER ZMIANY STATUSU ZALOGOWANIA
  firebase.auth().onAuthStateChanged(firebaseUser => {
  	if(firebaseUser){
  		console.log(firebaseUser);
  	}else{
  		console.log("User not logged in");
  	}
  });
/*
  logout.addEventListener('click', function(){
  	firebase.auth().signOut();
  });
  */
});
/*
var someDiv = document.getElementById('someDiv');
  var dbRef = firebase.database().ref().child('text');
  dbRef.on('value', snap => someDiv.innerText = snap.val());
*/
function addUserToDB(email, nick, userKey){
  var emails = email.replace('.', ',');
  var userData = {
    email: emails,
    name: nick,
    watched: {},
    added: {}
  };
  
  //var newKey = firebase.database().ref().child('users').push().key;
  firebase.database().ref().child('users/' + userKey).set(userData);
}