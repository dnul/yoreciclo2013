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
//		$('.facebook-btn').click(function (){
//			YORECICLO.Register.initRegistration();
//		});
	}
	}
})();

YORECICLO.Register = (function () {
	// private scope
	//set to false until further backend development and completed profile info is sent to view
	var fullProfile = false;
	var profileData = {};
	var requestUrl = "/signup";
	var app = {};
	return {
		//public scope
		successRegistration: function (){
			//console.log(profileData);
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
					YORECICLO.Register.subMission()
				}
				$(".formContainer").hide(1,function(){
					$(".step"+step).show(400);
				});
				


			})
			$('.registrationFormModal').submit(function(event){
				event.preventDefault();
				YORECICLO.Register.subMission(this);
			})
			if(!fullProfile) {
				//$('#registration').modal('show');
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
				var mapOptions = {
					center : new google.maps.LatLng(-34.602128,-58.430895),
					zoom : 10,
					mapTypeId : google.maps.MapTypeId.ROADMAP
				};
				var map = new google.maps.Map(document.getElementById(destination),
						mapOptions);
				
				this.app.map=map;
			},
			
			initRegitrationMap: function () {
				var ac = new usig.AutoCompleter('address', {
	       			rootUrl: 'http://servicios.usig.buenosaires.gob.ar/usig-js/2.3/',
	       			skin: 'usig4',
	       			onReady: function() {
	       				$('#address').val('').focus();
	       			},
	       			afterSelection: function(option) {
	       				//console.log('Se seleccionó la opción: '+option);
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
									//myLatlng = new google.maps.LatLng(-34.602128,-58.430895);
									$("#map-registration").show();
									YORECICLO.Maps.initializeMap("map-registration");
									var marker = new google.maps.Marker({
									      position: myLatlng,
									      map: YORECICLO.Maps.app.map,
									      title: 'ubicación'
									  });
									YORECICLO.Maps.app.map.setCenter(marker.getPosition());
									YORECICLO.Maps.app.map.setZoom(15);
									YORECICLO.Register.mapCoordenates = ([d.resultado.y,d.resultado.x]);
									var coopIds=YORECICLO.Register.getCooperativas([d.resultado.y,d.resultado.x]).map(function(a){
										return a.id;
									});
									YORECICLO.Register.idCooperativas=coopIds; 									
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
			}
	}

})();

