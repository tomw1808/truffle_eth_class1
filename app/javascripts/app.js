"use strict";
var app = angular.module("mySimpleWalletDapp", ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainController'
  }).when('/events', {
    templateUrl: 'views/events.html',
    controller: 'ShoweventsController'
  }).when('/sendfunds', {
    templateUrl: 'views/sendfunds.html',
    controller: 'SendfundsController'
  }).when('/permissions', {
    templateUrl: 'views/permissions.html',
    controller: 'PermissionsController'
  }).otherwise({redirectTo: '/'});
});