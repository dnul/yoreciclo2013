var cooperativas={
		data:[],
		polygons:[]
};
cooperativas.init= function(){
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
			cooperativas.polygons.push(zona);
			cooperativas.data.push(zonas[i]);
		}
	});
}
