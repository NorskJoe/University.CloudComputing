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

function getWeather(lat, long) {
	var url = "https://api.darksky.net/forecast/9eb9c37070bfd11b8f7dd8f0de01c1ca/" + lat + "," + long;
	$.getJSON(url, function(forecast) {
		console.log(forecast);
	});
	// alert('in getWeather');
	// var json_data;
	// var http = new XMLHttpRequest();
	// http.onreadystatechange = function() {
	// 	if (http.readyState == 4 && http.status == 200) {
	// 		alert('made request');
	// 		json_data = JSON.parse(http.responseText);
	// 		alert(json_data);
	// 	}
	// }
	// http.open("GET", url, true);
	// http.send();
	// alert('leaving getWeather');
	// // document.getElementById('info').innerHTML = json_data;
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

function test() {
	alert('in test function');
}

// ***** API KEYS ***** //

/***********	GOOGLE
 <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDCc4-ilxhIY3v2nhbMxFHHE1toVkcSu1o"></script>
*************/

/********** forecast.io (darksky)
https://api.darksky.net/forecast/9eb9c37070bfd11b8f7dd8f0de01c1ca/[latitude],[longitude]
***********/
