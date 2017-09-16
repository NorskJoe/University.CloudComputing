/*******************************************************
		GOOGLE MAP AND ROUTING
********************************************************/
var map;
var directionsService;
var directionsDisplay;
var start_lat;
var start_long;
var end_lat;
var end_long;

function initMap() {
	directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer;
	var melbourne = {
		lat: -37.813,
		lng: 144.963
	};
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: melbourne
	});

	setupStartAutoComplete(map);
	setupDestinationAutoComplete(map);

	directionsDisplay.setMap(map);
}

function setupDestinationAutoComplete(map) {
	var input = document.getElementById('destination_input');

	var autocomplete = new google.maps.places.Autocomplete(input);

	autocomplete.addListener('place_changed', function() {
		infoWindow.close();
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			window.alert("No details available for: '" + place.name + "'");
			return;
		}

	});
}

function setupStartAutoComplete(map) {
	var container = document.getElementById('main');
	var input = document.getElementById('start_input');

	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(container);

	var autocomplete = new google.maps.places.Autocomplete(input);

	autocomplete.addListener('place_changed', function() {
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			window.alert("No details available for: '" + place.name + "'");
			return;
		}
		start_lat = place.geometry.location.lat();
		start_long = place.geometry.location.lng();
	});
}

function planRoute() {
	var start = document.getElementById('start_input').value;
	var dest = document.getElementById('destination_input').value;

	var request = {
		origin: start,
		destination: dest,
		provideRouteAlternatives: true,
		travelMode: 'BICYCLING',
		unitSystem: google.maps.UnitSystem.METRIC
	}

	directionsService.route(request, function(response, status) {
		if (status == 'OK') {
			directionsDisplay.setDirections(response);
		} else {
			window.alert("Directions failed due to " + status);
		}
	});

	getWeather(start_lat, start_long);
}


/***************************************************
		GOOGLE USER SIGN IN
****************************************************/
function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
	// console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	// console.log('Name: ' + profile.getName());
	// console.log('Image URL: ' + profile.getImageUrl());
	// console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

// Not currently used
function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('signed out');
	});
}


/************************************************************
		API FUNCTIONS
*************************************************************/
function initApi() {
	gapi.client.load('rideendpoint', 'v1', null, 'https://cycleplan-s3542413.appspot.com/_ah/api');

	document.getElementById('insertQuote').onclick = function() {
		saveRide();
	}
}

function saveRide() {
	var _id = document.getElementById('txtAuthorName').value;
	var _s_lat = document.getElementById('s_lat').value;
	var _s_lng = document.getElementById('s_lng').value;
	var _d_lat = document.getElementById('d_lat').value;
	var _d_lng = document.getElementById('d_lng').value;

	var request = {};
	request.user_id = _id;
	request.start_lat = _s_lat;
	request.start_lng = _s_lng;
	request.end_lat = _d_lat;
	request.end_lng = _d_lng;

	console.log(_id);
	console.log(_s_lat);
	console.log(_s_lng);
	console.log(_d_lat);
	console.log(_d_lng);

	gapi.client.rideendpoint.insertRide(request).execute(function (resp) {
			if (!resp.code) {
				console.log(_id);
				console.log(_s_lat);
				console.log(_s_lng);
				console.log(_d_lat);
				console.log(_d_lng);
			}
			else {
				alert('error' + resp);
			}
	});
}

/*********************************************************************
		WEATHER FUNCTIONS
**********************************************************************/
function getWeather(lat, long) {
	var url = "https://api.darksky.net/forecast/9eb9c37070bfd11b8f7dd8f0de01c1ca/" + lat + "," + long;
	$.getJSON(url, function(forecast) {
		console.log(forecast);
	});
}
