var cooperativas={
		data:[],
		polygons:[]
};
cooperativas.init= function(){
	$.getJSON("/assets/coperativas_dondereciclo.json", function(zonas) {
		for ( var i in zonas) {
			zona = new google.maps.Polygon({
				paths : eval(zonas[i].polygon),
				strokeColor : zonas[i].color,
				strokeOpacity : 0.5,
				strokeWeight : 0.5,
				fillColor : zonas[i].color,
				fillOpacity : 0.5,
			});
			cooperativas.polygons.push(zona);
			cooperativas.data.push(zonas[i]);
		}
	});
}
