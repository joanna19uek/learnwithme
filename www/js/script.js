function goToSite(id){
    var anch = document.createElement('a');
    anch.setAttribute("href", "#"+id);
    anch.click();
}

(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC2E9hI9X2e2KCHyEiaz5vcaFXOFvY0HQc",    //browser key
        //apiKey: "AIzaSyBpHX7UlYiPCqkTRxFOi6bisAspEvOGMa4",    //android key
        authDomain: "learnwithme-98129.firebaseapp.com",
        databaseURL: "https://learnwithme-98129.firebaseio.com",
        projectId: "learnwithme-98129",
        storageBucket: "learnwithme-98129.appspot.com",
        messagingSenderId: "1032899670271"
    };
    firebase.initializeApp(config);
}());

$(document).ready(function(){
    const emailInput = $('#email');
    const passInput = $('#haslo');
    const btnLogIn = $('#zaloguj');
    const btnGLogIn = $("#zalogujG");
    const btnFBLogIn = $("#zalogujFB");
    const btnRegis = $("#zarejestruj");
    var info = $('#logInfo');

    emailInput.on('focus', function(){
		$(this).css("box-shadow", "none");
	});

    passInput.on('focus', function(){
		$(this).css("box-shadow", "none");
	});

    //EVENT LISTENER DO LOGOWANIA
    btnLogIn.on('click', function() {
        const email = emailInput.val();
        const passwd = passInput.val();
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email, passwd);
        
        info.css("color", "red");

        promise.catch(e => {
            //console.log(e.code);
  		    switch (e.code){
            case "auth/invalid-email":
              info.html("Niepoprawny email!");
              emailInput.css("box-shadow", "2px 2px 2px red");  					
              console.log(e.code);
              break;
            case "auth/user-not-found":
              info.html("Niepoprawny email!");
              emailInput.css("box-shadow", "2px 2px 2px red");  					
              console.log(e.code);
              break;  				
            case "auth/email-already-in-use":
              info.html("Email jest już w użyciu!");
              emailInput.css("box-shadow", "2px 2px 2px red");  
              console.log(e.code);
              break;
            case "auth/wrong-password":
              info.html("Niepoprawne hasło!");
              passInput.css("box-shadow", "2px 2px 2px red");
              console.log(e.code);
              break;
            case "":
            info.html('Logowanie udane!');
              
              break;
            default:
    		  info.html("Nieokreślony błąd.");
    		  console.log(e.code);
    		  break;
  			}
  			
		});	
		promise.then(function() {
			getAllAnn();
            info.html("");
            emailInput.val('').off('focus');
    	 	passInput.val('').off('focus');
		});
	});

    //EVENT LISTENER DO LOGOWANIA PRZEZ GOOGLE
    btnGLogIn.on('click', function() {
        info.html("Próba logowania do Google...");
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().useDeviceLanguage();
        firebase.auth().signInWithRedirect(provider);
        firebase.auth().getRedirectResult().then(function(result) {
            if (result.credential) {
                var token = result.credential.accessToken;
                console.log(token);
            }
            var user = result.user;
            console.log(user);
        }).catch(function(error) {
            var errorCode = error.code;
            console.log(errorCode);
            var errorMessage = error.message;
            console.log(errorMessage);
            var email = error.email;
            console.log(email);
            var credential = error.credential;
            console.log(credential);
        });
    });

    //EVENT LISTENER DO LOGOWANIA PRZEZ FB
    btnFBLogIn.on('click', function() {
        info.html("Próba logowania do FB...");
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().useDeviceLanguage();
        firebase.auth().signInWithRedirect(provider);
        firebase.auth().getRedirectResult().then(function(result) {
            if (result.credential) {
                var token = result.credential.accessToken;
                console.log(token);
            }
            var user = result.user;
            console.log(user);
        }).catch(function(error) {
            var errorCode = error.code;
            console.log(errorCode);
            var errorMessage = error.message;
            console.log(errorMessage);
            var email = error.email;
            console.log(email);
            var credential = error.credential;
            console.log(credential);
        });
    });

    //EVENT LISTENER DO REJESTRACJI
	btnRegis.on('click', function() {		
		var nickReg = $('#nickreg').val();
		const emailRegInput = $('#emailreg');
		const emailReg = emailRegInput.val();
		const passwdReg1Input = $('#hasloreg');
		const passwdReg1 = passwdReg1Input.val();
		const passwdReg2Input = $('#haslopowtreg');
		const passwdReg2 = passwdReg2Input.val();

		if (nickReg == null || nickReg == "") {
		    nickReg = emailReg.substring(0, emailReg.indexOf('@'));
	    }

	    emailRegInput.on('focus', function() {
		    $(this).css("box-shadow", "none");
		});

		passwdReg1Input.on('focus', function() {
		    $(this).css("box-shadow", "none");
		});

		passwdReg2Input.on('focus', function() {
		    $(this).css("box-shadow", "none");
		});

		var info = $('#regInfo');
        info.css("color", "red");
		if (passwdReg1 === passwdReg2) {
			const auth = firebase.auth();
			const promise = auth.createUserWithEmailAndPassword(emailReg, passwdReg1);
			promise.catch(e => {
				switch (e.code) {
					case "auth/invalid-email":
						info.html("Niepoprawny email!");
						emailRegInput.css("box-shadow", "2px 2px 2px red");
						console.log(e.code);
						break;
					case "auth/weak-password":
						info.html("Hasło musi zawierać co najlniej 6 znaków!");
						passwdReg1Input.css("box-shadow", "2px 2px 2px red");
						passwdReg2Input.css("box-shadow", "2px 2px 2px red");
						console.log(e.code);
						break;
					case "auth/email-already-in-use":
						info.html("Email jest już w użyciu!");
						emailRegInput.css("box-shadow", "2px 2px 2px red");
						passwdReg1Input.css("box-shadow", "2px 2px 2px red");
						passwdReg2Input.css("box-shadow", "2px 2px 2px red");
						console.log(e.code);
						break;
					default:
						info.html("Nieokreślony błąd.");
						console.log(e.code);
						break;
				}
			});
			promise.then(function() {
				info.html("");
				emailRegInput.css("border", "0px solid #ff7777").val("").off('focus');
				passwdReg1Input.css("border", "0px solid #ff7777").val("").off('focus');
				passwdReg2Input.css("border", "0px solid #ff7777").val("").off('focus');
				addUserToDB(emailReg, nickReg, firebase.auth().currentUser.uid);
				goToSite('afterRegPage');
			});
		} else {
			console.log("Hasła są niepoprawne");
			info.html("Hasła nie są identyczne!");
			passwdReg1Input.css("box-shadow", "2px 2px 2px red");
			passwdReg2Input.css("box-shadow", "2px 2px 2px red");
		}
	});

    //EVENT LISTENER ZMIANY STATUSU ZALOGOWANIA
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
            firebase.database().ref().child('users/' + firebaseUser.uid).once('value', function(snap) {
                if (snap.val() == null) {
                    addUserToDB(firebaseUser.email, firebaseUser.displayName, firebaseUser.uid);
                }
            });
            checkNotify(firebaseUser.uid);
            console.log(firebaseUser.uid);
            getAllAnn();
        } else {
            console.log("User not logged in");
        }
    });
});

function addUserToDB(email, nick, userKey) {
    var userData = {
        email: email,
        name: nick,
        watched: [],
        added: []
    };
    firebase.database().ref().child('users/' + userKey).set(userData);
}

function logout(){
    firebase.auth().signOut()
        .then(function() {
            console.log('Signout Succesfull');
            goToSite('startPage');
            }, function(error) {
                console.log('Signout Failed')
            }
        );
}

function getChartData() {
    var database = firebase.database().ref();
    var ilosc = [0,0,0,0,0,0,0];
    var daty = ['','','','','','',''];
    database.child('classifieds/').once("value", function(data) {
        var newAnn = data.val();
        for(var i = 0; i < 7; i++) {
            let today = getYesterdayDate(i);
            daty[i] = today;
            for (var iter in newAnn) {
                var dat = newAnn[iter].addDate;
                if (dat == today) {
                    ilosc[i] = ilosc[i] + 1;
                }
            }
        }
        chartClick(ilosc, daty);
    });
}

function getYesterdayDate(yesDay) {
    let nowaData = new Date();
    nowaData.setDate(nowaData.getDate() - yesDay);
    return formatDate(nowaData);
}

function chartClick(dbData, days) {
    var ctx = document.getElementById("chart").getContext('2d');
    var il = dbData;
    var d = days;
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: [d[0], d[1], d[2], d[3], d[4], d[5], d[6]],
            datasets: [{
                label: 'ilość dodanych ogłoszeń',
                data: [il[0], il[1], il[2], il[3], il[4], il[5], il[6], 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(123, 232, 157, 0.8)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(123, 232, 157, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            legend: {
                labels: {
                    boxWidth: 0,
                }
            },
            scales: {
                yAxes: [{}]
            }
        }
    });
    goToSite('chartPage');
}

function sendEmail() {
    cordova.plugins.email.isAvailable(
        function (isAvailable) {
            if (isAvailable) {
                cordova.plugins.email.open({
                    to:      ['asia_p99@tlen.pl', 'rsmyksy@gmail.com', 'lukasz.pudzisz@gmail.com', 'p.grzyb1995@gmail.com'],
                    subject: 'LearnWithMe - wsparcie',
                    body:    'Chciałbym zgłosić następujące błędy:\n'
                });
            } else {
                var ms = 'Brak skonfigurowanej poczty e-mail.';
                toast(ms, 3000);
            }
        }
    );
}

function checkNotify(userID){
	database.child('users/' + userID + '/notifications/').on('value', function(snap) {
		let menu1 = $(" div[data-role='panel'] > div > ul > :first-child > :first-child ");
    if (snap.val() == null) {        	
      menu1.removeClass('notifyStar');
    }else{        	
      menu1.addClass('notifyStar');        	
    }
  });
  database.child('users/' + userID + '/notifications/').once('value', function(snap) {		
    if (snap.val() != null) { 
      toast("Masz nieusunięte powiadomienia!", 1000);
    }
	});
}
