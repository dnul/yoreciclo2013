'use strict';

/* Controllers */

var controllers = angular.module('yoreciclo.controllers', []);

// Search Controller
controllers.controller('mainController', ['$scope', '$rootScope','$location', function($scope, $rootScope,$location) {
	$scope.initialize = function() {
				var mapOptions = {
					center : new google.maps.LatLng(-34.602128, -58.430895),
					zoom : 13,
					mapTypeId : google.maps.MapTypeId.ROADMAP,
					panControl : false,
					zoomControl : true,
					mapTypeControl : false,
					scaleControl : false,
					streetViewControl : false,
					overviewMapControl : false

				};
				var map = new google.maps.Map(document
						.getElementById("map-canvas"), mapOptions);
			}
}])

controllers.controller('homeController', ['$scope', '$rootScope','$location', function($scope, $rootScope,$location) {
	
	$scope.initialize = function() {
				var mapOptions = {
					center : new google.maps.LatLng(-34.602128, -58.430895),
					zoom : 13,
					mapTypeId : google.maps.MapTypeId.ROADMAP,
					panControl : false,
					zoomControl : true,
					mapTypeControl : false,
					scaleControl : false,
					streetViewControl : false,
					overviewMapControl : false

				};
				var map = new google.maps.Map(document
						.getElementById("map-canvas"), mapOptions);
			}
	
	$scope.initialize();
}])

controllers.controller('locationController', ['$scope', '$rootScope','$location', function($scope, $rootScope,$location) {
	
	console.log('location controller');
	$rootScope.ac=null;
	$scope.initGcba = function() {
		var ac = new usig.AutoCompleter('address', {
   			rootUrl: 'http://servicios.usig.buenosaires.gob.ar/usig-js/3.0/',
   			skin: 'usig4',
   			onReady: function() {
   				console.log('ready gcba');
   				$('#address').val('').focus();
   				console.log($('#address'));
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
							console.log(myLatlng);
							if($scope.marker){
								$scope.marker.setMap(null);
							}
							
							$scope.marker = new google.maps.Marker({
							      position: myLatlng,
							      draggable:true
							  });
							
							google.maps.event.addListener(
									$scope.marker,
								    'drag',
								    function() {
								        var lat=$scope.marker.position.lat();
								        var lng=$scope.marker.position.lng();
								        $scope.mapCoordenates = ([lat,lng]);
								    }
								);
							
							$scope.marker.setMap($scope.map);
							$scope.map.setCenter($scope.marker.getPosition());
							$scope.mapCoordenates = ([d.resultado.y,d.resultado.x]);
							console.log($scope.mapCoordenates);
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
	
	$scope.initializeMap = function (destination) {
		if($scope.map){
			return;
		}
		console.log('initializeMap');
		var center = new google.maps.LatLng(-34.602128,-58.430895);
		var mapOptions = {
				center : new google.maps.LatLng(-34.602128, -58.430895),
				zoom : 13,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				panControl : false,
				zoomControl : true,
				mapTypeControl : false,
				scaleControl : false,
				streetViewControl : false,
				overviewMapControl : false

			};
		var map = new google.maps.Map(document.getElementById(destination),
				mapOptions);
		
		$scope.map=map;

		map.setCenter(center);
		map.setZoom(15);
		
		google.maps.event.addListener(map, "click", function(event) {
		    if($scope.marker) {
		    	$scope.marker.setMap(null);
		    }

		    $scope.marker = new google.maps.Marker({
		        position: event.latLng,
		        map: map,
		        draggable:true,
		        title: "ubicacion"
		    });
		    
		    google.maps.event.addListener(
		    		$scope.marker,
				    'drag',
				    function() {
				        var lat=$scope.marker.position.lat();
				        var lng=$scope.marker.position.lng();
				        $scope.mapCoordenates = ([lat,lng]);
				    }
				);
		    
		    $scope.mapCoordenates = event.latLng;
		    console.log($scope.mapCoordenates);
		});
	}
	
	$scope.initGcba();
	$scope.initializeMap("map-registration");
}])