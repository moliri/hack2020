function initialize() {
	navigator.geolocation.getCurrentPosition(createMap);
}

function createMap(currentPosition) {
	var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

	var mapOptions = {
		center: pos
	};

	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);