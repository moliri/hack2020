var map = null; //makes map global
var pos = null;
var radius = 3200;
var mapCenter = null;
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

function initialize() {
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
}

/* starting script for intro page */
$(document).on('pageinit', '#intropage', function() {
	$('#startBtn').click(start);
});

function start() {
	$.mobile.changePage('#maps');
	setTimeout(initialize, 200);
	return false;
}

function find(results, status) {
	console.log(status);
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			(createMarker.bind({
				category: this.category,
				name: this.name,
				placeID: this.placeID
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
	/*var placeLoc = place.geometry.location;
	var icon = null;
	if (this.category == "hotels") {
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
	});*/
	var request = {
		placeID: this.placeID;
	}
	
	var infowindow = new google.maps.InfoWindow();
	
	service = new google.maps.places.PlacesService(map);
	
	var icon = null;
	if (this.category == "hotels") {
		icon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
	} else if (this.category == "department-stores") {
		icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
	} else if (this.category == "office-supplies") {
		icon = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
	}
	
	service.getDetails(request, function(place, status) {
    	if (status == google.maps.places.PlacesServiceStatus.OK) {
    		var marker = new google.maps.Marker({
    			map: map,
        		position: place.geometry.location
        		icon: icon;
        	});
	
			google.maps.event.addListener(marker, 'click', (function() {
				var infowindow = new google.maps.InfoWindow({
					content: '<div id="content">' +
						'<div id="siteNotice">' +
						'</div>' +
						'<h3 id="firstHeading" class="firstHeading">' + place.name + " "
							+ place.formatted_address + " " + place.opening_hours+ " " + place.icon '</h3>' +
						'</div>' +
						'</div>'
				});
				infowindow.open(map, marker);
			});
		 }	
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
	var done = _.after(list.length, hideLoadingIcon);
	for (var i = 0; i < list.length; i++) {
		var name = list[i];

		var request = {
			location: mapCenter,
			radius: radius,
			name: name
		};

		if (map != null) {
			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, find.bind({
				service: service,
				request: request,
				category: category,
				name: name,
				done: done,
				placeID: service.place_id
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
	console.log("hide loading icon");
}

function showLoadingIcon() {
	console.log("show loading icon");
}
