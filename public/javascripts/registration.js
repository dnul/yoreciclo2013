var YORECICLO = {}
YORECICLO.Utils = (function(){
	return{
		doRequest: function(url,data,callback){
			$.ajax({
				  type: "POST",
				  url: url,
				  data: data,
				  success: callback,
				  error:callback
				});
		}
	}
})();

YORECICLO.Home = (function (){

	return {
	init: function (){
// $('.facebook-btn').click(function (){
// YORECICLO.Register.initRegistration();
// });
	}
	}
})();

YORECICLO.Register = (function () {
	// private scope
	// set to false until further backend development and completed profile info
	// is sent to view
	var fullProfile = false;
	var profileData = {};
	var requestUrl = "/signup";
	var app = {};
	return {
		// public scope
		successRegistration: function (){
			// console.log(profileData);
		},
		subMission: function (event){
			if(!fullProfile) {
				profileData.items =[];
				$(".disabled").each(function(){
					profileData.items.push($(this).attr('data-material'));
				});
				profileData.address = this.mapCoordenates;
				profileData.coopIds= this.idCooperativas;
				profileData.addressText=$("#address").val();
				YORECICLO.Utils.doRequest(requestUrl,profileData,YORECICLO.Register.successRegistration)
			}
		},
		initRegistration: function (){
			$(".formContainer").first().show();
			$(".btn.step").on("click",function(event){
				var step = $(event.target).attr("data-step");
				if (parseInt(step) == 3) {
					YORECICLO.Register.subMission();
					for(var i=0;i<profileData.coopIds.length;i++){
						var id=profileData.coopIds[i];
						
						var coop=cooperativas.data.filter(function(d){
							return id==d.id;
						})[0];
						
						$('#coops_local').append("<p>" + coop.nombre +"</p>");
					}
					
				}
				$(".formContainer").hide(1,function(){
					$(".step"+step).show(400,function(){
						if(step==2){
							YORECICLO.Maps.initRegitrationMap();
						}
					});
				});
				


			})
			$('.registrationFormModal').submit(function(event){
				event.preventDefault();
				YORECICLO.Register.subMission(this);
			})
			if(!fullProfile) {
				// $('#registration').modal('show');
			}
		},
		getCooperativas: function(coords){
			var coops=[];
			for(var i=0;i<cooperativas.polygons.length;i++){
				var poly=cooperativas.polygons[i];
				var latLng=new google.maps.LatLng(coords[0],coords[1]);
				if(poly.containsLatLng(latLng)){
					coops.push(cooperativas.data[i]);
				}
			}
			return coops;
		},
		mapCoordenates: [],
		idCooperativas: []
	}
})();

YORECICLO.Maps = (function (){

	return{
			app : {},
			initializeMap : function (destination) {
				if(this.app.map){
					return;
				}
				console.log('initializeMap');
				var center = new google.maps.LatLng(-34.602128,-58.430895);
				var mapOptions = {
					center : center,
					zoom : 10,
					mapTypeId : google.maps.MapTypeId.ROADMAP
				};
				var map = new google.maps.Map(document.getElementById(destination),
						mapOptions);
				
				this.app.map=map;

				YORECICLO.Maps.app.map.setCenter(center);
				YORECICLO.Maps.app.map.setZoom(15);
				
				google.maps.event.addListener(map, "click", function(event) {
				    if(YORECICLO.Maps.app.marker) {
				    	YORECICLO.Maps.app.marker.setMap(null);
				    }

				    YORECICLO.Maps.app.marker = new google.maps.Marker({
				        position: event.latLng,
				        map: YORECICLO.Maps.app.map,
				        draggable:true,
				        title: "ubicacion"
				    });
				    
				    google.maps.event.addListener(
				    		YORECICLO.Maps.app.marker,
						    'drag',
						    function() {
						        var lat=YORECICLO.Maps.app.marker.position.lat();
						        var lng=YORECICLO.Maps.app.marker.position.lng();
						        YORECICLO.Register.mapCoordenates = ([lat,lng]);
						        YORECICLO.Maps.updateCooperativas([lat,lng]);
						    }
						);
			        YORECICLO.Maps.updateCooperativas(event.latLng.lat(),event.latLng.lng());
				});
			},
			
			initRegitrationMap: function () {
				var ac = new usig.AutoCompleter('address', {
	       			rootUrl: 'http://servicios.usig.buenosaires.gob.ar/usig-js/2.3/',
	       			skin: 'usig4',
	       			onReady: function() {
	       				$('#address').val('').focus();
	       			},
	       			afterSelection: function(option) {
	       				// console.log('Se seleccionó la opción: '+option);
	       			},
					afterGeoCoding : function(pt) {
						if (pt instanceof usig.Punto) {
							$.ajax({
								type : "GET",
								url : 'http://ws.usig.buenosaires.gob.ar/rest/convertir_coordenadas?x=' + pt.x +'&y=' + pt.y + '&output=lonlat',
								data : null,
								dataType: 'jsonp',
								success : function(d) {
									var myLatlng = new google.maps.LatLng(d.resultado.y,d.resultado.x);
									if(YORECICLO.Maps.app.marker){
										YORECICLO.Maps.app.marker.setMap(null);
									}
									
									YORECICLO.Maps.app.marker = new google.maps.Marker({
									      position: myLatlng,
									      draggable:true
									  });
									
									google.maps.event.addListener(
											YORECICLO.Maps.app.marker,
										    'drag',
										    function() {
										        var lat=YORECICLO.Maps.app.marker.position.lat();
										        var lng=YORECICLO.Maps.app.marker.position.lng();
										        YORECICLO.Register.mapCoordenates = ([lat,lng]);
										        YORECICLO.Maps.updateCooperativas(lat,lng);
										    }
										);
									
									YORECICLO.Maps.app.marker.setMap(YORECICLO.Maps.app.map);
									YORECICLO.Maps.app.map.setCenter(YORECICLO.Maps.app.marker.getPosition());
									YORECICLO.Register.mapCoordenates = ([d.resultado.y,d.resultado.x]);
									YORECICLO.Maps.updateCooperativas(d.resultado.y,d.resultado.x);
								},
								error : null
							});
						}
					}
				});
				ac.addSuggester('Catastro', {
					inputPause : 200,
					minTextLength : 1,
					showError : false
				});
				
				$("#map-registration").show();
				YORECICLO.Maps.initializeMap("map-registration");
			},
			updateCooperativas:function(lat,Lng){
				var coopIds=YORECICLO.Register.getCooperativas([lat,Lng]).map(function(a){
					return a.id;
				});
				YORECICLO.Register.idCooperativas=coopIds; 
			}
	}

})();

