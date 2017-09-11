function initMap() {
	var melbourne = { lat: -37.813, lng: 144.963 };
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: melbourne
	});
	// var marker = new google.maps.Marker({
	// 	position: centre,
	// 	map: map
	// });
}

function test() {
	alert('in test function');
}




// ***** API KEY ***** //

// <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDCc4-ilxhIY3v2nhbMxFHHE1toVkcSu1o"></script>
