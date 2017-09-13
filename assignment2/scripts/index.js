function initMap() {
	var melbourne = { lat: -37.813, lng: 144.963 };
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: melbourne

	});
	var container = document.getElementById('main');
	var input = document.getElementById('place_input');

	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(container);

	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);

	var infoWindow = new google.maps.InfoWindow();
	var infoWindowContent = document.getElementById('infoWindow_content');
	infoWindow.setContent(infoWindowContent);

	autocomplete.addListener('place_changed', function() {
		infoWindow.close();
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			window.alert("No details available for: '" + place.name + "'");
			return;
		}

		if(place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		}
		else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}

		var address = '';
		if(place.address_components) {
			adress =
			[
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
			].join(' ');
		}

		infoWindowContent.children['place_icon'].src = place.icon;
		infoWindowContent.children['place_name'].textContent = place.name;
		infoWindowContent.children['place_address'].textContent = address;
		infoWindow.open(map);
	});
}

function test() {
	alert('in test function');
}




// ***** API KEY ***** //

// <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDCc4-ilxhIY3v2nhbMxFHHE1toVkcSu1o"></script>
