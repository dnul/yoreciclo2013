'use strict';


// Declare app level module which depends on filters, and services
angular.module('yoreciclo', [
  'ngRoute',
  'yoreciclo.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/home',{templateUrl:'assets/partials/home.html',controller:'homeController'})
  .when('/',{templateUrl:'assets/partials/home.html',controller:'homeController'})	
  .when('/materials', {templateUrl: 'assets/partials/material.html'})
  .when('/location', {templateUrl: 'assets/partials/location.html',controller:'locationController'})
  .otherwise({redirectTo: '/'});
}]);