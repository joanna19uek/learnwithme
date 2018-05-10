var database = firebase.database().ref();

var addNewAnn = function() {
    goToSite('addAnnoun');
    $('#tagsNewAnn').val("");
    $('#dateNewAnn').val("");
    $('#startTimeNewAnn').val("");
    $('#endTimeNewAnn').val("");
    $('#placeNewAnn').val("");
    $('#descriptionAnn').val("");
};

var addAnnoun = function() {
	var tagi = $('#tagsNewAnn');
	var dateAnn = $('#dateNewAnn');
	var startTime = $('#startTimeNewAnn');
	var endTime = $('#endTimeNewAnn');
	var placeAnn = $('#placeNewAnn');
	var description = $('#descriptionAnn');

	var dateAdd = formatDate(new Date());

	var tagiS = tagi.val();
	var dateAnnS = formatDate(new Date(dateAnn.val()));
	var startTimeS = startTime.val();
	var endTimeS = endTime.val();
	var placeAnnS = placeAnn.val();
	var descriptionS = description.val();

	var userID = firebase.auth().currentUser.uid;

	var validateInfo = $('#newAnnInfo').css("color", "red");

	if (tagiS.length == 0 || dateAnnS.length == 0 ||
		startTimeS.length == 0 || endTimeS.length == 0 || 
		placeAnnS.length == 0 || descriptionS.length == 0) {
		console.log("Nie wszystkie pola są wypełnione!");
		validateInfo.text("Proszę uzupełnić puste pola!");
	} else {
		var announData = {
			tags: tagiS,
			date: dateAnnS,
			startTime: startTimeS,
			endTime: endTimeS,
			place: placeAnnS,
			description: descriptionS,
			addDate: dateAdd,
			lastEdit: dateAdd,
			active: true,
			author: userID,
			followersNumb: 0,
			followsBy: {},
			notifications: {}
		};
		
		

		var newKey = firebase.database().ref().child('classifieds').push().key;
		//console.log(newKey);

		var shortData = newKey;
		database.child('/classifieds/' + newKey).set(announData);
		//database.child('/users/' + userID + '/added').push(shortData);
		database.child('/users/' + userID + '/added/' + shortData).set(shortData);
		//goToSite('mainAdd');
		getMyAnn();
		tagi.text("");
		dateAnn.text("");
		startTime.text("");
		endTime.text("");
		placeAnn.text("");
		description.text("");
		validateInfo.text("");
	}
};

function formatDate(date) {
    var month = date.getMonth()+1;
    var day = date.getDate();

    var output = ((''+day).length<2 ? '0' : '') + day + '-' +
        ((''+month).length<2 ? '0' : '') + month +
        '-' + date.getFullYear();

    return output;
}

function getAllAnn() {
	var mainCont = $("#mainAll > div[data-role='main']");
	mainCont.empty();
	mainCont.append('<p id="comAll">Przykro nam, ale nie ma obecnie dostępnych ogłoszeń :(<br>' +' Dodaj jakieś klikając przycisk + u dołu ekranu!</p>');
			
	var usId = firebase.auth().currentUser.uid;
	var allChilldAdded = database.child('classifieds/').once("value", function(data) {
		
		
		var newAnn = data.val();
		
		//database.child('users/' + firebase.auth().currentUser.uid + "/watched/" + data.key).once('value', function(snap) { myWatch = snap.val(); console.log(myWatch); });
		
		//database.child('users/' + firebase.auth().currentUser.uid + "/added/" + data.key).once('value', function(snap) { myAnn = snap.val(); console.log(myAnn); });
		for(iter in newAnn){
			//console.log(iter);
			
			var announInfo = "";
			if(usId == newAnn[iter].author){
				announInfo = "<div class='container'  onclick='showMyAnnoun(\"" + iter + "\", \"#mainAll\")'><span class='annKey'>" + iter + "</span><p class='infoAboutMeeting'>" +
				newAnn[iter].date + " " + newAnn[iter].startTime + "-" + newAnn[iter].endTime + 
				"<br>" + newAnn[iter].place + "<br>" + newAnn[iter].tags +  
				"</p><img src='img/greenBook.png' class='bookic'/><p class='undimg'>" + newAnn[iter].followersNumb + "</p></div>";
			}else if(newAnn[iter].followsBy != null && newAnn[iter].followsBy.hasOwnProperty(usId)){
				announInfo = "<div class='container'  onclick='showThisAnnoun(\"" + iter + "\", \"#mainAll\")'><span class='annKey'>" +iter + "</span><p class='infoAboutMeeting'>" +
				newAnn[iter].date + " " + newAnn[iter].startTime + "-" + newAnn.endTime + 
				"<br>" + newAnn[iter].place + "<br>" + newAnn[iter].tags +  
				"</p><img src='img/greenBook.png' class='bookic'/><p class='undimg'>" + newAnn[iter].followersNumb + "</p></div>";
			}else{
				announInfo = "<div class='container'  onclick='showThisAnnoun(\"" + iter + "\", \"#mainAll\")'><span class='annKey'>" + iter + "</span><p class='infoAboutMeeting'>" +
				newAnn[iter].date + " " + newAnn[iter].startTime + "-" + newAnn[iter].endTime + 
				"<br>" + newAnn[iter].place + "<br>" + newAnn[iter].tags +  
				"</p><img src='img/greyBook.png' class='bookic'/><p class='undimg'>" + newAnn[iter].followersNumb + "</p></div>";
			}
			
			if(mainCont.is(':empty')){	
							
				mainCont.append(announInfo);
				$('#comAll').hide();
			}else{
					
				mainCont.children().first().before(announInfo);			
				$('#comAll').hide();		
			}
		}
	});
	
	goToSite('mainAll');
	
}
function getMyAnn() {
	var mainContAdd = $("#mainAdd > div[data-role='main']");
	mainContAdd.empty();
	var firstInfo = '<p id="comAdd">Nie dodałeś/dodałaś jeszcze żadnego ogłoszenia.<br> Zmień to klikając przycisk + u dołu ekranu.</p>';	
        mainContAdd.append(firstInfo);
        database.child('users/' + firebase.auth().currentUser.uid + "/added").once("value", function(data) {
		//console.log(data.val());
		if (data.val() == null) {
			
			
		} else {
			$('#comAdd').hide();
			var announ = data.val();
			for(iter in announ){
				database.child('classifieds/' + iter).once("value").then(function(snapshot) {
				//console.log(snapshot.val());
				var newAnn = snapshot.val();
				var content = "<div class='container' onclick='showMyAnnoun(\"" + iter + "\", \"#mainAdd\")'><span class='annKey'>" + announ + "</span><p class='infoAboutMeeting'>" +
				newAnn.date + " " + newAnn.startTime + "-" + newAnn.endTime + 
						"<br>" + newAnn.place + "<br>" + newAnn.tags +  
						"</p><img src='img/greenBook.png' class='bookic'/><p class='undimg'>" + newAnn.followersNumb + "</p></div>";
				if(mainContAdd.is(':empty')){
				
					mainContAdd.append(content);
				}else{
					mainContAdd.children().first().before(content);
					
				}
				

					//console.log('dodano nowe ogłoszenie!');
				});
			}
		}
	});
	goToSite('mainAdd');
}

function getMyWatched() {
	var mainContWatch = $("#mainWatched > div[data-role='main']");
	mainContWatch.empty();
	var firstInfoWat = '<p id="comWatched">Nie obserwujesz obecnie żadnych ogłoszeń.<br>Wróć do widoku wszystkich ogłoszeń, wybierz najbardziej interesujące, przejdź do szczegółów i kliknij ikonę książki, aby dodać to ogłoszenie do obserwowanych.</p>';
	mainContWatch.append(firstInfoWat);
	database.child('users/' + firebase.auth().currentUser.uid + "/watched").once("value", function(data) {
		
		if (data.val() == null) {
			//mainContWatch.append(firstInfoWat);
		} else {
			var announ = data.val();
			$('#comWatched').hide();
			for(iter in announ){
				database.child('classifieds/' + iter).once("value").then(function(snapshot) {				
					var newAnn = snapshot.val();
					var contentWat = "<div class='container' onclick='showThisAnnoun(\"" + iter + "\", \"#mainWatched\")'><span class='annKey'>" + announ + "</span><p class='infoAboutMeeting'>" +
						newAnn.date + " " + newAnn.startTime + "-" + newAnn.endTime + 
						"<br>" + newAnn.place + "<br>" + newAnn.tags +  
						"</p><img src='img/greenBook.png' class='bookic'/><p class='undimg'>" + newAnn.followersNumb + "</p></div>";
					if(mainContWatch.is(':empty')){				
						mainContWatch.append(contentWat);
					}else{
						mainContWatch.children().first().before(contentWat);					
					}				
				});
			}
		}
	});
	goToSite('mainWatched');
	
}


function showThisAnnoun(key, back){
	switch(back){
		case '#mainAll':
			$('#detailBackAll').show();
			$('#detailBackWat').hide();
			break;
		case '#mainWatched':
			$('#detailBackWat').show();
			$('#detailBackAll').hide();
			break;
	}
	var annKey = key;
	var usId = firebase.auth().currentUser.uid;
	goToSite('AnnDetailsPage');	
	//$('#detailBack').attr('href', back);
	$('#annKeyDetail').text(annKey);
	var myWatchKey = [];
	database.child('classifieds/' + annKey).once("value").then(function(snapshot) {
		//console.log(snapshot.val());
		var newAnn = snapshot.val();
		database.child('users/' + newAnn.author).once("value").then(function(snapshot) {$('#usersAnnDetails').text('Ogłoszenie użytkownika ' + snapshot.val().name);});
		$('#dateDetails').text(newAnn.date);				
		$('#startTimeDetails').text(newAnn.startTime);
		$('#endTimeDetails').text(newAnn.endTime);
		$('#placeDetails').text(newAnn.place);
		$('#descDetails').text(newAnn.description);
		$('#tagsDetails').text(newAnn.tags);
		$('#followersNumb').text(newAnn.followersNumb);
		//database.child('users/' + usId + "/watched/" + key).on('value', function(snap) { myAnn = snap.val(); });
				
		database.child('users/' + usId + "/watched/" + key).once("value").then(function(snapshot) {
			myWatchKey = snapshot.val();
			//console.log(myWatch);		
			if(myWatchKey != null){
				$('#imgDetails').attr('src', 'img/greenBook-big.png');
			}
		});				
	});
}

function toogleWatch(){
	var newKey = $('#annKeyDetail').text();
	var myWatch;
	var usId = firebase.auth().currentUser.uid;
	var follNum = $('#followersNumb');
	database.child('users/' + usId + "/watched/" + newKey).once("value").then(function(snapshot) {
		myWatch = snapshot.val();		
		if(myWatch == null){
			database.child('/classifieds/' + newKey + '/followsBy/' + usId).set(usId).then(function() {
			    //console.log("Remove succeeded.")
			    database.child('/classifieds/' + newKey + '/followersNumb').transaction(function(currentRank) {
			    	follNum.text(currentRank + 1);
				  return currentRank + 1;
				});
			  })
			  .catch(function(error) {
			    //console.log("Remove failed: " + error.message)
			  });
			database.child('/users/' + usId + '/watched/' + newKey).set(newKey);			
			$('#imgDetails').attr('src', 'img/greenBook-big.png');
		}else{
			database.child('/classifieds/' + newKey + '/followsBy/' + usId).remove().then(function() {
			    //console.log("Remove succeeded.")
			    database.child('/classifieds/' + newKey + '/followersNumb').transaction(function(currentRank) {
			    	follNum.text(currentRank - 1);
				  return currentRank - 1;
				});
			  })
			  .catch(function(error) {
			    //console.log("Remove failed: " + error.message)
			  });
			database.child('/users/' + usId + '/watched/' + newKey).remove();			
			$('#imgDetails').attr('src', 'img/128greybook.png');
		}		
	});
}

function getNotifications(){
	let usId = firebase.auth().currentUser.uid;

	var mainContNotice = $("#notice > div[data-role='main']");
	mainContNotice.empty();
	var firstInfoNotice = '<p id="comNotice">Obecnie nie masz żadnych powiadomień.</p>';
	mainContNotice.append(firstInfoNotice);
	database.child('users/' + firebase.auth().currentUser.uid + "/notifications").once("value", function(data) {
		
		if (data.val() != null) {
			var notice = data.val();
			$('#comNotice').hide();
			
			for(iter in notice){
				var contentNotice = "<div class='noticeContainer'>" + 
						"<p class='noticeHead'>" + notice[iter].titl + "</p>" + 
						"<p class='noticeText'>" + notice[iter].infoText + "</p>" +
                    	"<button class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext deletebutt' onclick='removeNotification(\"" + iter + "\", this)'></button>" +
                		"</div>";	                				
					if(mainContNotice.is(':empty')){				
						mainContNotice.append(contentNotice);
					}else{
						mainContNotice.children().first().before(contentNotice);					
					}					
			}
		}
	});
	goToSite('notice');
}

function removeNotification(key, notek){
	let usId = firebase.auth().currentUser.uid;
	var notifCont = $(notek).parent().get(0);
	
	database.child('/users/' + usId + '/notifications/' + key).remove().then(function() {
			    notifCont.remove();
			    console.log("Usunięto: " + key);
			  })
			  .catch(function(error) {
			    console.log("Remove notification failed: " + error.message);
			  });
}