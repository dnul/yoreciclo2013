var app = {};
function initialize() {
	console.log('i');
	var mapOptions = {
		center : new google.maps.LatLng(-34.602128, -58.430895),
		zoom : 12,
		disableDefaultUI: true,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);

	app.map = map;
	app.polygons = [];
	app.trails = [];

	$.getJSON("/assets/coperativas_dondereciclo.json", function(zonas) {
		for ( var i in zonas) {
			color =zonas[i].color;
			console.log(color);
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
	
	$.ajax({
		  type: "GET",
		  url: "/registeredUsers",
		  success: function(data){
			  console.log(data);
			  for(var i=0;i<data.length;i++){
				  var user=data[i];
				  console.log(user);
				  var point=new google.maps.LatLng(user.lat,user.lon);
				  
				  var marker = new google.maps.Marker({
				      position: point,
				      map: app.map,
				      title: 'ubicación',
				      infoWindowIndex : i,
				      content:  '<p><b>' + user.name + '</b></p>'  + '<p>Junta:' +  user.recycledItems + '</p><p><img src="http://graph.facebook.com/' + user.facebookId + '/picture" ><p>'
				  });
				  
				  var contentHtml = '<p><b>' + user.name + '</b></p>'  + '<p>Junta:' +  user.recycledItems + '</p><p><img src="http://graph.facebook.com/' + user.facebookId + '/picture" ><p>';
				  var infoWindow = new google.maps.InfoWindow({
					    content: contentHtml
					  });
				
				  google.maps.event.addListener(marker, 'click', function() {
					  	infoWindow.setContent(this.content);
					    infoWindow.open(app.map, this);
					  });
			  }
			  
			  

		  }
		});

	var query = "SELECT Location, type, coperativa_id, info, materiales_ids FROM "
			+ '118cbZRCvb78ebldQprexrXYNUePEc8ezKmef4Bo'
			+ " WHERE type='recorrido'";
	var encodedQuery = encodeURIComponent(query);

	// Construct the URL
	var url = [ 'https://www.googleapis.com/fusiontables/v1/query' ];
	url.push('?sql=' + encodedQuery);
	url.push('&key=AIzaSyCOxacNgvjqDguY2ALWc-QvzuMXTRLSDM4');
	url.push('&callback=?');
	$.ajax({
        url: url.join(''),
        dataType: 'jsonp',
        success: function (data) {
            var rows = data['rows'];
            
            for(var i=0;i<rows.length;i++){
            	var recorrido=rows[i];
            	console.log(recorrido);
            	
            	var path=recorrido[0].geometry.coordinates.map(function(d){
            		return new google.maps.LatLng(d[1],d[0]);
            	});
            	var trail = new google.maps.Polyline({
            		    path: path,
            		    strokeColor: "#FF0000",
            		    strokeOpacity: 0.5,
            		    strokeWeight: 3,
            		  });
            	trail.setMap(app.map);
            	google.maps.event.addDomListener(trail,'click',function(e){
            		console.log(recorrido);
            		var infowindow = new google.maps.InfoWindow({
                        content: "<p>" + recorrido[4] + "</p><p>" + recorrido[3] +"</p>"});
        			infowindow.setPosition( path[0]);
        			infowindow.open(app.map);
            	})
            }
        }
	});
//	 var layer = new google.maps.FusionTablesLayer({
//		query : {
//			select : 'location',
//			from : '118cbZRCvb78ebldQprexrXYNUePEc8ezKmef4Bo',
//			where: "type = 'recorrido'"
//		},
//		options : {
//			suppressInfoWindows : false
//		},
//		styles : [ {
//			polylineOptions : {
//				 strokeColor: "#00ffff",
//				 strokeWeight: "2" 
//			}
//		} ],
//		map : app.map
//	});
//	layer.setMap(app.map);
	// console.log(layer);

}
google.maps.event.addDomListener(window, 'load', initialize);
