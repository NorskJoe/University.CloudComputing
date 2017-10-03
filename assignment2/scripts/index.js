/*******************************************************
		GOOGLE MAP AND ROUTING
********************************************************/
var map;
var directionsService;
var directionsDisplay;
var startGeo = {};
var destGeo = {};

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
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			window.alert("No details available for: '" + place.name + "'");
			return;
		}
		destGeo.lat = place.geometry.location.lat();
		destGeo.lng = place.geometry.location.lng();
		document.getElementById('d_lat').value = destGeo.lat;
		document.getElementById('d_lng').value = destGeo.lng;
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
		startGeo.lat = place.geometry.location.lat();
		startGeo.lng = place.geometry.location.lng();
		document.getElementById('s_lat').value = startGeo.lat;
		document.getElementById('s_lng').value = startGeo.lng;

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
	getDistance(start, dest);
	getWeather(startGeo.lat, startGeo.lng, destGeo.lat, destGeo.lng);
	document.getElementById('bottom-box').style.display = "inline-block";
	document.getElementById('info').style.display = "inline-block";

}

function getDistance(start, dest) {
	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix(
		{
			origins: [start],
			destinations: [dest],
			travelMode: 'BICYCLING'
		}, distanceCallback);

}

function distanceCallback(response, status) {
	if (status == 'OK') {
		var origins = response.originAddresses;
		var destinations = response.destinationAddresses;

		for (var i = 0; i < origins.length; i++) {
			var results = response.rows[i].elements;

			for (var j = 0; j < results.length; j++) {
				var element = results[j];
				var distance = element.distance.text;
				var duration = element.duration.text;
				document.getElementById('distance').innerHTML = "Total distance: "+distance;
				document.getElementById('duration').innerHTML = "Estimated duration: "+duration;
			}
		}
	}
}

/***************************************************
		GOOGLE USER SIGN IN
****************************************************/
function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
	document.getElementById('user_id').value = profile.getEmail();
	document.getElementById('bottom-box').style.display = "block";
	viewRides();
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
		API-DATASTORE FUNCTIONS
*************************************************************/
function initApi() {
	gapi.client.load('rideendpoint', 'v1', null, 'https://cycleplan-api.appspot.com/_ah/api');

	document.getElementById('save_route').onclick = function() {
		saveRide();
	}
}

function saveRide() {
	if (checkSignIn()) {
		var email = document.getElementById('user_id').value;
		var s_lat = document.getElementById('s_lat').value;
		var s_lng = document.getElementById('s_lng').value;
		var d_lat = document.getElementById('d_lat').value;
		var d_lng = document.getElementById('d_lng').value;

		var request =
		{
			userId: email,
			startLat: s_lat,
			startLng: s_lng,
			endLat: d_lat,
			endLng: d_lng
		}

		gapi.client.rideendpoint.insertRide(request).execute(function(resp) {
			if (!resp.code) {
				alert('Ride saved');
			}
		});
	}
	else {
		alert("You must be signed into Google to save rides");
	}

}

function viewRides() {
	if (checkSignIn()) {
		gapi.client.rideendpoint.listRide().execute(function(resp) {
			var user_email = $("#user_id").val();
			for (var i = 0; i < resp.items.length; i++) {
				if (resp.items[i].userId == user_email) {
					createList(resp.items[i]);
				}
			}
		});
	}
	else {
		alert("You must be signed in to view your rides");
	}
}

function createList(rideObject) {
	var startLat = rideObject.startLat;
	var startLng = rideObject.startLng;
	var endLat = rideObject.endLat;
	var endLng = rideObject.endLng;

	var start = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+startLat+","+startLng;
	var dest = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+endLat+","+endLng;

	var start_suburb;
	var start_address;
	$.ajax({
		dataType: "json",
		url: start,
		success: function(data) {
			var suburb = data.results[0].address_components[2].long_name;
			var state = data.results[0].address_components[4].long_name;
			var country = data.results[0].address_components[5].long_name;
			start_address = suburb + ", " + state + ", " + country;
			start_suburb = suburb;
		}
	});

	$.ajax({
		dataType: "json",
		url: dest,
		success: function(data) {
			var suburb = data.results[0].address_components[2].long_name;
			var state = data.results[0].address_components[4].long_name;
			var country = data.results[0].address_components[5].long_name;
			var dest_address = suburb + ", " + state + ", " + country;
			var ul = document.getElementById('ride_list');
			var li = document.createElement("li");
			li.appendChild(document.createTextNode(start_suburb+" to "+suburb));
			li.onclick = function() {
				getSavedRide(start_address, dest_address);
			};
			ul.appendChild(li);
		}
	});
}

function getSavedRide(start, dest) {
	$("#start_input").val(start);
	$("#destination_input").val(dest);

	getLatLng(start, true);
	getLatLng(dest, false);
	planRoute();
	getCollisionData();
}

function getLatLng(address, start_flag) {
	var request = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=AIzaSyCE-GZ0miPhO4ez96w3KqaT75dDfXFM-uQ";

	$.ajax({
		dataType: "json",
		url: request,
		async: false,
		success: function(data) {
			if (start_flag == true) {
				startGeo.lat = data.results[0].geometry.location.lat;
				startGeo.lng = data.results[0].geometry.location.lng;
			}
			else {
				destGeo.lat = data.results[0].geometry.location.lat;
				destGeo.lng = data.results[0].geometry.location.lng;
			}
		}
	});
}

function checkSignIn() {
	var email = document.getElementById('user_id').value;
	if (email == "") {
		return false;
	} else {
		return true;
	}
}

/*********************************************************************
		WEATHER FUNCTIONS
**********************************************************************/
function getWeather(s_lat, s_lng, d_lat, d_lng) {
	var proxy = "https://cors-anywhere.herokuapp.com/";
	var request = "https://api.darksky.net/forecast/9eb9c37070bfd11b8f7dd8f0de01c1ca/" + s_lat + "," + s_lng + "?units=si";

	$.ajax({
		url: proxy + request,
		success: function(data) {
			$("#start_weather").html("Weather at start: ");
			$("#start_weather").append(data.currently.summary+", ");
			$("#start_weather").append(data.currently.apparentTemperature.toFixed(0)+"&deg;C, ");
			$("#start_weather").append((data.currently.precipProbability*100).toFixed(0)+"% chance of rain");
		}
	});

	var request = "https://api.darksky.net/forecast/9eb9c37070bfd11b8f7dd8f0de01c1ca/" + d_lat + "," + d_lng + "?units=si";

	$.ajax({
		url: proxy + request,
		success: function(data) {
			$("#dest_weather").html("Weather at destination: ");
			$("#dest_weather").append('\t\t '+data.currently.summary+", ");
			$("#dest_weather").append('\t\t '+data.currently.apparentTemperature.toFixed(0)+"&deg;C, ");
			$("#dest_weather").append('\t\t '+(data.currently.precipProbability*100).toFixed(0)+"% chance of rain");
		}
	});
}

/***********************************************************************
		VIC ROADS COLLISIONS DATA FUNCTIONS
************************************************************************/
function getCollisionData() {
	var start_suburb = $("#start_input").val();
	var dest_suburb = $("#destination_input").val();
	start_suburb = start_suburb.match(/[a-zA-Z\s]*(?=,)/);
	dest_suburb = dest_suburb.match(/[a-zA-Z\s]*(?=,)/);
	start_suburb = start_suburb[0].toUpperCase();
	dest_suburb = dest_suburb[0].toUpperCase();
	$.ajax(
		{
			url: 'https://services2.arcgis.com/18ajPSI0b3ppsmMt/arcgis/rest/services/Crashes_Last_Five_Years/FeatureServer/0/query?where=1%3D1&outFields=INJ_OR_FATAL,BICYCLIST,LGA_NAME_ALL&outSR=4326&f=json',
			dataType: 'json',
			success: function(data) {
				var names = data;
				var total_accidents = 0;
				$.each(names.features, function(k,v) {
						// console.log(v.attributes.LGA_NAME_ALL);
						if(v.attributes.LGA_NAME_ALL == start_suburb && v.attributes.BICYCLIST > 0) {
							total_accidents++;
						}
						if(v.attributes.LGA_NAME_ALL == dest_suburb && v.attributes.BICYCLIST > 0) {
							total_accidents++;
						}
				});
				total_accidents = total_accidents/5/52;
				document.getElementById('accidents').innerHTML = "Road accidents in these areas*: "+total_accidents.toFixed(2);
			}
		});
}
