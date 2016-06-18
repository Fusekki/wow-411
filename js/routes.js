//ROUTES

wowApp.config(function ($routeProvider) {
    
    $routeProvider
    
    .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeCtrl'
    })
    
   .when('/characterSearch', {
        templateUrl: 'pages/characterSearch.htm',
        controller: 'characterSearchCtrl'
    })
    
    .when('/characterResult', {
        templateUrl: 'pages/characterResult.htm',
        controller: 'characterCtrl'
    })
    
    .when('/realms', {
        templateUrl: 'pages/realms.htm',
        controller: 'realmCtrl'
    })
    
});