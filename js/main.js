var map = null; //makes map global
var pos = null;
var radius = 3200;
var mapCenter = null;
var business_markers = [];
var BUSINESSES = {
	"lodging": ["Hilton",
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
	"department-stores": ["Sears",
		"Lowe’s",
		"The Home Depot",
		"Macy’s",
		"Walmart",
		"Bath and Body Works",
		"Kmart",
		"Office Depot"
	],
	"office-supplies": [
		"Best Buy",
		"Staples",
		"Office Depot",
		"Office Max",
		"Apple"
	]
}

/* https://developers.google.com/places/documentation/supported_types */
var TYPES = {
	"lodging": [
		"lodging"
	],
	"department-stores": [
		"store",
		"department_store",
		"clothing_store"
	],
	"office-supplies": [
		"store",
		"electronics_store"
	]
}
var infowindow = new google.maps.InfoWindow();

function initialize() {
	showLoadingIcon();
	navigator.geolocation.getCurrentPosition(createMap);
}

function createMap(p) {
	pos = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
	mapCenter = pos;

	var mapOptions = {
		center: pos,
		zoom: 14
	};

	var mapCanvas = $("#map-canvas")[0];
	console.log($("#map-canvas").css("height"));
	map = new google.maps.Map(mapCanvas, mapOptions);

	var marker = new google.maps.Marker({
		icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
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

	google.maps.event.addListener(map, 'center_changed', function(event) {
		console.log("center changed")
		mapCenter = map.getCenter();
	});

	hideLoadingIcon();
}

/* starting script for intro page */
$(document).on('pageinit', '#intropage', function() {
	$('#startBtn').click(start);
});

function start() {
	$.mobile.changePage('#maps');
	return false;
}

$(document).on('pageinit', '#maps', function() {
	initialize();
})

function find(results, status) {
	console.log(status);
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			(createMarker.bind({
				category: this.category,
				name: this.name
			}))(results[i]);
		}
		this.done();
	} else if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
		setTimeout(function() {
			this.service.nearbySearch(this.request, find.bind(this))
		}.bind(this), 1000);
	} else {
		this.done();
	}
}

function createMarker(place) {
	if (place.name.indexOf(this.name) < 0) return;
	var placeLoc = place.geometry.location;
	var icon = null;
	if (this.category == "lodging") {
		icon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
	} else if (this.category == "department-stores") {
		icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
	} else if (this.category == "office-supplies") {
		icon = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
	}
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: icon
	});

	google.maps.event.addListener(marker, 'click', (function() {
		infowindow.close();
		infowindow.setOptions({
			content: '<div id="content">' +
				'<div id="siteNotice">' +
				'</div>' +
				'<h5 id="firstHeading" class="firstHeading">' + place.name + '</h5>' +
				'<h5>' + place.open_now + '</h5>' +
				'<h5>' + place.vicinity + '</h5>' +
				'<img src= + https://maps.googleapis.com/maps/api/place/photo?photoreference=' + place.photos.photo_reference +
					'&sensor=false&maxheight=' + 300 + '&maxwidth=' + 500 + '&key=AIzaSyAXfPben6GxSeCpmnXbZKg_HZz9w0vhSsQ</img>' +
				'</div>' +
				'</div>'
		});

		infowindow.open(map, marker);
	}).bind(this));

	business_markers.push(marker);
}

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
	showLoadingIcon();
	var done = _.after(list.length, hideLoadingIcon);
	for (var i = 0; i < list.length; i++) {
		var name = list[i];

		var request = {
			location: mapCenter,
			radius: radius,
			name: name,
			types: TYPES[category]
		};

		if (map != null) {
			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, find.bind({
				service: service,
				request: request,
				category: category,
				name: name,
				done: done
			}));
		}
	}
}

/**
 * Assign events to buttons
 */
$(document).ready(function onReady() {
	$(".category").click(function onClick() {
		var category = $(this).attr("id", function(i, category) {
			console.log(category);
			switchToCategory(category);
		});
	});
});

function hideLoadingIcon() {
	$("#loading").hide();
}

function showLoadingIcon() {
	$("#loading").show(0);
}
