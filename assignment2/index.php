<!DOCTYPE html>
<html>

<head>
	<title>Welcome | CyclePlan</title>
	<meta charset="utf-8">
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
	<meta name="google-signin-client_id" content="446461886659-hb3c8fvjgvh97bgleboa5khg1j5bdkto.apps.googleusercontent.com">
	<link rel="stylesheet" href="css/index.css">
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js">
	</script>
	<script type="text/javascript" src="scripts/index.js"></script>
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDCc4-ilxhIY3v2nhbMxFHHE1toVkcSu1o&libraries=places,geometry"></script>
	<script type="text/javascript" src="https://apis.google.com/js/platform.js"></script>
	<script type="text/javascript" src="https://apis.google.com/js/client.js"></script>
</head>

<body onload="initMap(); initApi();" class="main">

	<!-- The banner -->
	<div id="banner">
		<a href="/"><img src="images/logo.PNG"></a>
		<h1>Welcome to CyclePlan</h1>
	</div>

	<!-- Login menu -->
	<div id="login">
		<div class="g-signin2" data-onsuccess="onSignIn"></div>
	</div>

	<!-- Main map and input -->
	<div>
		<div id="main">
			<div>
				<div id="title">
					Search
				</div>
			</div>
			<div id="map_input">
				<input type="text" id="start_input" placeholder="Enter a starting point">
				<input type="text" id="destination_input" placeholder="Enter a destination">
				<input type="submit" onclick="planRoute(); getData();" value="Plan Route">
			</div>
		</div>
		<div id="map"></div>
	</div>

	<!-- Information display -->
	<div id="info">
		<p id="distance">Total distance: </p>
		<p id="duration">Estimated duration: </p>
		<p id="start_weather">Starting location weather: </p>
		<p id="dest_weather">Finish location weather: </p>
		<p id="ascent">Total ascent: </p>
		<p id="descent">Total descent: </p>
		<p id="accidents">Number of accidents in this area*: </p>
		<p>*Involving bicycles in an average week (data taken from vicroads.gov.au)</p>
	</div>

	<!-- User history -->
	<div id="history">
		<form action="javascript:void(0);">
			<div><input type="hidden" id="user_id" ></input>
			</div>
			<div><input type="hidden" id="s_lat"></input>
			</div>
			<div><input type="hidden" id="s_lng"></input>
			</div>
			<div><input type="hidden" id="d_lat"></input>
			</div>
			<div><input type="hidden" id="d_lng"></input>
			</div>
			<div><input id="save_route" type="submit" value="Save Route"></div>
			<div><input id="view_saved" type="submit" value="View Saved Routes"></div>
		</form>
	</div>

	<div id="test">

	</div>

	<footer>
		<p>Created By: Joseph Johnson - s3542413</p>
		<p><a href="https://darksky.net/poweredby/">Powered by DarkSky</a></p>
	</footer>
</body>

</html>
