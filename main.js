function initialize() {
	navigator.geolocation.getCurrentPosition(createMap);
}

function createMap(currentPosition) {
	var pos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);

	var mapOptions = {
		center: pos,
		zoom: 14
	};

	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	
	var marker = new google.maps.Marker({
      	position: pos,
      	map: map,
      	title: 'Your Location'
  	});
	
}


google.maps.event.addDomListener(window, 'load', initialize);
