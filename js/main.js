var map = null; //makes map global
var business_markers = [];
var HOTELS = ["Hilton",
	"Marriott",
	"Omni Hotels",
	"Wyndham Hotels",
	"Days Inn",
	"Super 8",
	"Trevelodge",
	"Holiday Inn",
	"Motel 6",
	"Westin",
	"Best Western"
];
var DEPARTMENT_STORES = ["Sears",
	"Lowe’s",
	"The Home Depot",
	"Macy’s",
	"Walmart",
	"Bath and Body Works",
	"Kmart",
	"Office Depot"
];
var OFFICE_SUPPLIES = [
	"Best Buy",
	"Staples",
	"Office Depot",
	"Office Max",
	"Apple"

]

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
	map = new google.maps.Map(mapCanvas, mapOptions);

	var marker = new google.maps.Marker({
		position: pos,
		map: map,
		title: 'Your Location'
	});

	searchStores(currentPosition);
}

/* starting script for intro page */
$(document).on('pageinit', '#intropage', function() {
	$('#startBtn').click(start);
});

function start() {
	$.mobile.changePage('#maps');
	return false;
}

function searchStores(currentPosition) {
	var pos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);

	//var searchCriteria = prompt("Search stores in your area")
	var type = HOTELS;
	for (var i = 0; i < type.length; i++) {
		var name = type[i];

		var request = {
			location: pos,
			radius: 10000,
			name: name
		};

		if (map != null) {
			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, find);
		}
	}
}

function find(results, status) {
	console.log(status);
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
	business_markers.push(marker);
}


google.maps.event.addDomListener(window, 'load', initialize);
