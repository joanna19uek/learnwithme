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
			followsBy: {}
		};
		
		

		var newKey = firebase.database().ref().child('classifieds').push().key;
		console.log(newKey);

		var shortData = newKey;
		database.child('/classifieds/' + newKey).set(announData);
		//database.child('/users/' + userID + '/added').push(shortData);
		database.child('/users/' + userID + '/added/' + shortData).set(shortData);
		goToSite('mainAdd');
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
	mainCont.text('');
	var myAnn = [], myWatch =[];

	database.child('users/' + firebase.auth().currentUser.uid + "/watched").on('value', function(snap) { myWatch = snap.val(); });
	database.child('users/' + firebase.auth().currentUser.uid + "/added").on('value', function(snap) { myAnn = snap.val(); });
	
	database.child('classifieds/').on("child_added", function(data) {
		var newAnn = data.val();		
		var isMine = false;	
		var isWatch = false;		
		
		for(isM in myAnn){		
			if(myAnn[isM] == data.key){				
				isMine = true;			
				break;
			}
		}
		
		for(isM in myWatch){		
			if(myWatch[isM] == data.key){				
				isWatch = true;			
				break;
			}
		}		
		
		if(isMine){
			mainCont.append("<div class='container'  onclick='showMyAnnoun(\"" + data.key + "\", \"#mainAll\")'><span class='annKey'>" + data.key + "</span><p class='infoAboutMeeting'>" +
			newAnn.date + " " + newAnn.startTime + "-" + newAnn.endTime + 
			"<br>" + newAnn.place + "<br>" + newAnn.tags +  
			"</p><img src='img/greenBook.png' class='bookic'/><p class='undimg'>" + newAnn.followersNumb + "</p></div>");
		}else if(isWatch){
			mainCont.append("<div class='container'  onclick='showThisAnnoun(\"" + data.key + "\", \"#mainAll\")'><span class='annKey'>" + data.key + "</span><p class='infoAboutMeeting'>" +
			newAnn.date + " " + newAnn.startTime + "-" + newAnn.endTime + 
			"<br>" + newAnn.place + "<br>" + newAnn.tags +  
			"</p><img src='img/greenBook.png' class='bookic'/><p class='undimg'>" + newAnn.followersNumb + "</p></div>");
		}else{
			mainCont.append("<div class='container'  onclick='showThisAnnoun(\"" + data.key + "\", \"#mainAll\")'><span class='annKey'>" + data.key + "</span><p class='infoAboutMeeting'>" +
			newAnn.date + " " + newAnn.startTime + "-" + newAnn.endTime + 
			"<br>" + newAnn.place + "<br>" + newAnn.tags +  
			"</p><img src='img/greyBook.png' class='bookic'/><p class='undimg'>" + newAnn.followersNumb + "</p></div>");
		}
		
		//console.log(myAnn);
		//console.log(prevChildKey);
		//console.log('dodano nowe ogłoszenie!');
		//console.log(data);
	});
	
	goToSite('mainAll');
}
function getMyAnn() {
	var mainContAdd = $("#mainAdd > div[data-role='main']");
	mainContAdd.text('');
	database.child('users/' + firebase.auth().currentUser.uid + "/added/").on("child_added", function(data, prevChildKey) {
		//console.log(data.val());
		if (data.val() == null) {
			mainContAdd.text("Nic tu nie ma :(");
		} else {
			var announ = data.val();
			
			database.child('classifieds/' + announ).once("value").then(function(snapshot) {
				//console.log(snapshot.val());
				var newAnn = snapshot.val();
				mainContAdd.append("<div class='container' onclick='showMyAnnoun(\"" + announ + "\", \"#mainAdd\")'><span class='annKey'>" + announ + "</span><p class='infoAboutMeeting'>" +
					newAnn.date + " " + newAnn.startTime + "-" + newAnn.endTime + 
					"<br>" + newAnn.place + "<br>" + newAnn.tags +  
					"</p><img src='img/greenBook.png' class='bookic'/><p class='undimg'>" + newAnn.followersNumb + "</p></div>");

				//console.log('dodano nowe ogłoszenie!');
			});
		}
	});
	goToSite('mainAdd');
}

function getMyWatched() {
	var mainContWatch = $("#mainWatched > div[data-role='main']");
	mainContWatch.text('');
	database.child('users/' + firebase.auth().currentUser.uid + "/watched/").on("child_added", function(data, prevChildKey){
		//console.log(data.val());
		if (data.val() == null) {
			mainContAdd.text("Nic tu nie ma :(");
		} else {
			var announ = data.val();
			
			database.child('classifieds/' + announ).once("value").then(function(snapshot) {
				//console.log(snapshot.val());
				var newAnn = snapshot.val();
				mainContWatch.append("<div class='container' onclick='showThisAnnoun(\"" + announ + "\", \"#mainWatched\")'><span class='annKey'>" + announ + "</span><p class='infoAboutMeeting'>" +
					newAnn.date + " " + newAnn.startTime + "-" + newAnn.endTime + 
					"<br>" + newAnn.place + "<br>" + newAnn.tags +  
					"</p><img src='img/greenBook.png' class='bookic'/><p class='undimg'>" + newAnn.followersNumb + "</p></div>");

				//console.log('dodano nowe ogłoszenie!');				
			});
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
	var myWatched;
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
