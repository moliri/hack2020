function initialize() {
	navigator.geolocation.getCurrentPosition(createMap);
}

function createMap(currentPosition) {
	var pos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);

	var mapOptions = {
		center: pos,
		zoom: 14
	};

	var mapCanvas = $("#map-canvas")[0];
	console.log(mapCanvas);
	var map = new google.maps.Map(mapCanvas, mapOptions);
	console.log("test");
	
	var marker = new google.maps.Marker({
      	position: pos,
      	map: map,
      	title: 'Your Location'
  	});
	
}

/* starting script for intro page */
$(document).on('pageinit', '#intropage', function(){
	$('#startBtn').click(start);
});

function start() {
	$.mobile.changePage('#maps');  
	return false;
}
	

google.maps.event.addDomListener(window, 'load', initialize);
