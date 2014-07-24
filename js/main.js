var map = null; //makes map global
var pos = null;
var radius = 3200;
var business_markers = [];
var BUSINESSES = {
	"hotels": ["Hilton",
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
	],
	"department stores": ["Sears",
		"Lowe’s",
		"The Home Depot",
		"Macy’s",
		"Walmart",
		"Bath and Body Works",
		"Kmart",
		"Office Depot"
	],
	"office_supplies": [
		"Best Buy",
		"Staples",
		"Office Depot",
		"Office Max",
		"Apple"

	]
}

function initialize() {
	navigator.geolocation.getCurrentPosition(createMap);
}

function createMap(p) {
	pos = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);

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

	google.maps.event.addListener(map, 'bounds_changed', function(event) {
		console.log("bounds chagned")
		var bounds = map.getBounds();

		var ne = bounds.getNorthEast();
		var sw = bounds.getSouthWest();

		var proximitymeter = google.maps.geometry.spherical.computeDistanceBetween(sw, ne);

		radius = proximitymeter;
	});

	searchStores();
}

/* starting script for intro page */
$(document).on('pageinit', '#intropage', function() {
	$('#startBtn').click(start);
});

function start() {
	$.mobile.changePage('#maps');
	return false;
}




function searchStores() {
	switchToCategory("hotels");
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

$(document).on('category_switch', function(e) {
	var type = e.type;
	switchToCategory(type);
})

function switchToCategory(category) {
	// clear exisiting business markers
	for (var i = 0; i < business_markers.length; i++) {
		business_markers[i].setMap(null);
	}
	business_markers = [];

	// add markers for new category
	var list = BUSINESSES[category];
	for (var i = 0; i < list.length; i++) {
		var name = list[i];

		console.log(radius);
		var request = {
			location: pos,
			radius: radius,
			name: name
		};

		if (map != null) {
			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, find);
		}
	}
}
