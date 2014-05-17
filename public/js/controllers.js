'use strict';

/* Controllers */

var controllers = angular.module('yoreciclo.controllers', []);

// Search Controller
controllers.controller('mapController', ['$scope', '$rootScope','$location', function($scope, $rootScope,$location) {
	console.log('mapController');
	$scope.initializeMap = function (destination) {
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
		
		$rootScope.map=map;

		map.setCenter(center);
		map.setZoom(15);
		
	}
	
	$scope.initializeMap('home-map')
}])



controllers.controller('homeController', ['$scope', '$rootScope','$location','$http', function($scope, $rootScope,$location,$http) {
	console.log('homeController');
	
	$http.get('/registeredUsers').success(function(data){
		for(var i=0;i<data.length;i++){
			  var user=data[i];
			  var point=new google.maps.LatLng(user.lat,user.lon);
			  
			  
			  var icons=""
			if(user.recycledItems!=null){
				if(user.recycledItems.search('vi')!=-1){
					icons+='<i class="fa fa-glass"></i>'
				}
				if(user.recycledItems.search('pl')!=-1){
					icons+='<i class="fa fa-ticket"></i>'
				}
				if(user.recycledItems.search('pa')!=-1){
					icons+='<i class="fa fa-archive"></i>'
				}
				if(user.recycledItems.search('me')!=-1){
					icons+='<i class="fa fa-wrench"></i>'
				}
			}
			  
			  var marker = new google.maps.Marker({
			      position: point,
			      map: $rootScope.map,
			      title: 'ubicación',
			      infoWindowIndex : i,
			      content:  '<p><b>' + user.name + '</b></p>'  + '<p>' +  icons + '</p><p><img src="http://graph.facebook.com/' + user.facebookId + '/picture" ><p>'
			  });
			  
			  
			  var contentHtml = '<p><b>' + user.name + '</b></p>'  + '<p>' +  icons + '</p><p><img src="http://graph.facebook.com/' + user.facebookId + '/picture" ><p>';
			  var infoWindow = new google.maps.InfoWindow({
				    content: contentHtml
				  });
			
			  google.maps.event.addListener(marker, 'click', function() {
				  	infoWindow.setContent(this.content);
				    infoWindow.open($rootScope.map, this);
				  });
		  }

	});
}])

controllers.controller('materialsController', ['$scope', '$rootScope','$location','$http', function($scope, $rootScope,$location,$http) {
	console.log('materialsController');
	$scope.materials={};
	$scope.materialCount=0;
	$scope.selectionChanged=false;
	$scope.registerMaterials= function(){
		$http.post('/submitMaterials',$scope.materials).success(function(d){
			console.log('submitted ok');
			$location.path('/');
		})
	}
	
	$scope.canSubmit = function(){
		
	}
	
	$scope.toggleMaterial=function(id){
		$scope.selectionChanged=true;
		if($scope.materials[id]){
			delete $scope.materials[id]
			$scope.materialCount-=1
		}else{
			$scope.materials[id]=1;
			$scope.materialCount+=1
		}
		
	}
	$scope.loadCurrentMaterials = function(){
		$http.get("/currentUser").success(function(data){
				if (data.recycledItems) {
					var items = data.recycledItems.replace('[', '')
							.replace(']', '').replace(' ', '')
							.split(',')
					console.log(items);
					for ( var i = 0; i < items.length; i++) {
						var id = items[i].trim();
						console.log(id);
						$scope.materials[id] = 1;
						$scope.materialCount += 1
					}
					$scope.materialCount = items.length;
				}
		})
	}
	$scope.loadCurrentMaterials();
}])

controllers.controller('locationController', ['$scope', '$rootScope','$location','$http', function($scope, $rootScope,$location,$http) {
	
	console.log('location controller');
	$rootScope.ac=null;
	$rootScope.marker=null;
	$scope.selectionChanged=false;
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
								        console.log($scope.mapCoordenates);
								        console.log($scope.mapCoordenates);
								        $scope.selectionChanged=true;
										$scope.$apply();
								    }
								);
							
							$rootScope.marker.setMap($rootScope.map);
							$rootScope.map.setCenter($rootScope.marker.getPosition());
							$scope.mapCoordenates = [d.resultado.y,d.resultado.x];
							$scope.selectionChanged=true;
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
//		if($rootScope.map){
//			return;
//		}
		
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
				        console.log($scope.mapCoordenates);
				        console.log($scope.mapCoordenates);
				        $scope.mapCoordenates = ([lat,lng]);
					    $scope.$apply();
					    $scope.selectionChanged=true;
				    }
				);
		    
		    $scope.mapCoordenates = [event.latLng.d,event.latLng.e];
		    $scope.selectionChanged=true;
		    $scope.$apply();
		    $rootScope.$apply();
		});
	}
	
	$scope.registerLocation= function(coordenates){
		$http.post("/submitAddress",coordenates).success(function(data){
			$('step2').addClass('donestep');
			$location.path('materials');
		})
	}
	
	$scope.loadCurrentLocation = function(){
		$http.get("/currentUser").success(function(data){
			if(data!=null && data.lat && data.lon){
				var point=new google.maps.LatLng(data.lat,data.lon);
				 $rootScope.marker = new google.maps.Marker({
				        position: point,
				        map: $rootScope.map,
				        draggable:true,
				        title: "ubicacion"
				    });
				 $rootScope.map.setCenter(point);
				 
				 google.maps.event.addListener(
							$rootScope.marker,
						    'dragend',
						    function() {
						        var lat=$rootScope.marker.position.lat();
						        var lng=$rootScope.marker.position.lng();
						        $scope.mapCoordenates = [lat,lng];
						        console.log($scope.mapCoordenates);
						        console.log($scope.mapCoordenates);
						        $scope.selectionChanged=true;
								$scope.$apply();
						    }
						);
			}
		})
	}
	
	$scope.initializeMap("map-registration");
	$scope.initGcba();
	$scope.loadCurrentLocation();
}])


controllers.controller('coperativaController', ['$scope', '$rootScope','$location','$http', function($scope, $rootScope,$location,$http) {
	
	$scope.colors=['#5680fc','#55d7d7','#7e55fc','#00e13c','#ef9e40','#9e7151','#00e13c','#e14f9e','#a9a9a9'];
	$scope.colorIndex=0;
	$scope.recuperadores=[{name:"Martin Rodriguez"},{name:"Pablo Rodriguez"},{name:"Juan Rodriguez"},{name:"Mariano Rodriguez"}]
	console.log('coperativa controller');
	$rootScope.ac=null;
	$rootScope.marker=null;
	$scope.recorridos=[];
	$scope.selectionChanged=false;
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
								        console.log($scope.mapCoordenates);
								        console.log($scope.mapCoordenates);
								        $scope.selectionChanged=true;
										$scope.$apply();
								    }
								);
							
							$rootScope.marker.setMap($rootScope.map);
							$rootScope.map.setCenter($rootScope.marker.getPosition());
							$scope.mapCoordenates = [d.resultado.y,d.resultado.x];
							$scope.selectionChanged=true;
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
		
        //Intialize the Direction Service
        $scope.service = new google.maps.DirectionsService();
        $scope.recorridoId=0;
        
		$scope.path=new google.maps.MVCArray();
		$scope.markers=[]

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
		   

		    var marker = new google.maps.Marker({
		        position: event.latLng,
		        map: $rootScope.map,
		        draggable:true,
		        title: $scope.markers.length + "id"
		    });
		    
		    marker.idpath=$scope.markers.length;
		    
		    $scope.markers.push(marker);
		    console.log($scope.markers);   
		    google.maps.event.addListener(
		    		marker,
				    'dragend',
				    function() {
				        var lat=marker.position.lat();
				        var lng=marker.position.lng();
				        $scope.mapCoordenates = ([lat,lng]);
					    $scope.$apply();
					    $scope.selectionChanged=true;
				    }
				);
		    
		    $scope.drawRoute();
		    $scope.$apply();
		    $rootScope.$apply();
		});
	}
	
	
	$scope.newRecorrido=function(){
		console.log('asd');
		$scope.poly = null;
		$scope.markers=[];
		$scope.path=[];
		$scope.colorIndex+=1;
	}
	$scope.stopRecorrido=function(){
		console.log($scope.path);
		$scope.recorridoId+=1;
		var recorrido = {id:$scope.recorridoId,color:$scope.colors[$scope.colorIndex]};
		$scope.currentRecorrido=recorrido;
		$scope.currentRecorrido.path=$scope.path;
		$scope.currentRecorrido.poly=$scope.poly;
		$scope.recorridos.push($scope.currentRecorrido);
		console.log($scope.recorridos);
		$scope.newRecorrido();
	}
	
	$scope.drawRoute = function(){
		if($scope.poly!=null){
			console.log('delete poly')
			$scope.poly.setMap(null);
			$scope.path=new google.maps.MVCArray(); 
		}
		console.log($scope.colors);
		var strokeColor=$scope.colors[$scope.colorIndex];
		
		console.log(strokeColor);
        $scope.poly = new google.maps.Polyline({ map: $rootScope.map, strokeColor: strokeColor });
        

        var waypoints=[]
        for(var i=1; i < $scope.markers.length-1; i++){
        	waypoints.push({location:$scope.markers[i].position}); 
        }
        
        var request = {
        	      origin: $scope.markers[0].position,
        	      destination: $scope.markers[$scope.markers.length-1].position,
        	      waypoints: waypoints,
        	      optimizeWaypoints: false,
        	      travelMode: google.maps.TravelMode.WALKING
        	  };
        
        $scope.poly.setPath($scope.path);
        $scope.service.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                    $scope.path.push(result.routes[0].overview_path[i]);
                }
            }
        });
	}
	
	$scope.initializeMap("map-registration");
	$scope.initGcba();
}])