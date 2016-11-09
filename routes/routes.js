//ROUTES

wowApp.config(function ($routeProvider) {
    
    $routeProvider
    
    .when('/', {
        templateUrl: 'templates/home.htm',
        controller: 'homeCtrl'
    })
        

   .when('/characterSearch', {
        templateUrl: 'templates/characterSearch.htm',
        controller: 'characterSearchCtrl'
    })
    
    .when('/characterResult', {
        templateUrl: 'templates/characterResult.htm',
        controller: 'characterCtrl'
    })
    
    .when('/realms', {
        templateUrl: 'templates/realms.htm',
        controller: 'realmCtrl'
    })
    
});