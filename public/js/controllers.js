'use strict';

/* Controllers */

var controllers = angular.module('yoreciclo.controllers', []);

// Search Controller
controllers.controller('mapController', ['$scope', '$rootScope','$location', function($scope, $rootScope,$location) {
	console.log('mapController');
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
				overviewMapControl : false,
				scrollwheel:false
			};
		var map = new google.maps.Map(document.getElementById(destination),
				mapOptions);
		
		$scope.map=map;

		map.setCenter(center);
		map.setZoom(15);
		
	}
	
	$scope.initializeMap('home-map')
}])



controllers.controller('homeController', ['$scope', '$rootScope','$location', function($scope, $rootScope,$location) {
	console.log('homeController');
}])

controllers.controller('locationController', ['$scope', '$rootScope','$location','$http', function($scope, $rootScope,$location,$http) {
	
	console.log('location controller');
	$rootScope.ac=null;
	$rootScope.marker=null;
	$scope.initGcba = function() {
		var ac = new usig.AutoCompleter('address', {
   			rootUrl: 'http://servicios.usig.buenosaires.gob.ar/usig-js/3.0/',
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
							if($rootScope.marker){
								$rootScope.marker.setMap(null);
								delete $rootScope.marker;
								delete $scope.mapCoordenates;
							}
							
							$rootScope.marker = new google.maps.Marker({
							      position: myLatlng,
							      draggable:true
							  });
							
							google.maps.event.addListener(
									$rootScope.marker,
								    'dragend',
								    function() {
								        var lat=$rootScope.marker.position.lat();
								        var lng=$rootScope.marker.position.lng();
								        $scope.mapCoordenates = [lat,lng];
										$scope.$apply();
								    }
								);
							
							$rootScope.marker.setMap($rootScope.map);
							$rootScope.map.setCenter($rootScope.marker.getPosition());
							$scope.mapCoordenates = [d.resultado.y,d.resultado.x];
							$scope.$apply();
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
		if($rootScope.map){
			return;
		}
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
				overviewMapControl : false,
				scrollwheel:false
			};
		var map = new google.maps.Map(document.getElementById(destination),
				mapOptions);
		
		$rootScope.map=map;

		map.setCenter(center);
		map.setZoom(15);
		
		google.maps.event.addListener(map, "click", function(event) {
		    if($rootScope.marker) {
		    	$rootScope.marker.setMap(null);
		    	delete $rootScope.marker;
		    	delete $scope.mapCoordenates;
		    }
		    console.log(event.latLng);

		    $rootScope.marker = new google.maps.Marker({
		        position: event.latLng,
		        map: $rootScope.map,
		        draggable:true,
		        title: "ubicacion"
		    });
		    
		    google.maps.event.addListener(
		    		$rootScope.marker,
				    'dragend',
				    function() {
				        var lat=$rootScope.marker.position.lat();
				        var lng=$rootScope.marker.position.lng();
				        $scope.mapCoordenates = ([lat,lng]);
					    $scope.$apply();
				    }
				);
		    
		    $scope.mapCoordenates = event.latLng;
		    console.log($scope.mapCoordenates);
		    $scope.$apply();
		    $rootScope.$apply();
		});
	}
	
	$scope.registerLocation= function(coordenates){
		$http.post("/submitAddress",coordenates).success(function(data){
			console.log(data);
		})
	}
	
	$scope.initializeMap("map-registration");
	$scope.initGcba();
}])