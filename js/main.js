var map = null; //makes map global

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
	map = new google.maps.Map(mapCanvas, mapOptions);
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

function searchStores(currentPosition) {
	var pos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
	
	var searchCriteria = prompt("Search stores in your area")

	var request = {
		location: pos,
		radius: 2000,
		types: [searchCriteria]
	};
	
	if(map != null) {
		var service = new google.maps.places.PlacesService();
	}
	
	service.nearbySearch(request, find);
}

function find(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
	map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
	if(map != null) {
		infowindow.open(map, this);
	}
  });
  
  console.log("created marker");
}
	

google.maps.event.addDomListener(window, 'load', initialize);
