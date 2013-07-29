var app = {};
console.log('hola');
function initialize() {
	console.log('i');
	var mapOptions = {
		center : new google.maps.LatLng(-34.602128, -58.430895),
		zoom : 12,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);

	app.map = map;
	app.polygons = [];

	$.getJSON("/assets/coperativas_dondereciclo.json", function(zonas) {
		console.log('hola');
		for ( var i in zonas) {
			color = '#'
					+ ('000000' + (Math.random() * 0xFFFFFF << 0).toString(16))
							.slice(-6)
			zona = new google.maps.Polygon({
				paths : eval(zonas[i].polygon),
				strokeColor : color,
				strokeOpacity : 0.5,
				strokeWeight : 0.5,
				fillColor : color,
				fillOpacity : 0.5,
			});
			app.polygons.push(zona);
			zona.setMap(app.map);
		}
	});

	// var layer = new google.maps.FusionTablesLayer({
	// query: {
	// select: 'location',
	// from: '118cbZRCvb78ebldQprexrXYNUePEc8ezKmef4Bo'
	// },
	// options: {
	// suppressInfoWindows: true
	// },
	// styles: [{
	// polygonOptions: {
	// fillColor: '#00FF00',
	// fillOpacity: 1.0,
	// strokeWeight: 0.5,
	// strokeOpacity:0.5
	// }
	// }],
	// map: app.map
	// });
	// layer.setMap(app.map);
	// console.log(layer);

}
google.maps.event.addDomListener(window, 'load', initialize);
