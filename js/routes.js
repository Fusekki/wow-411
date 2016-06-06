//ROUTES

wowApp.config(function ($routeProvider) {
    
    $routeProvider
    
    .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })
    
   .when('/characterSearch', {
        templateUrl: 'pages/characterSearch.htm',
        controller: 'homeController'
    })
    
    .when('/characterResult', {
        templateUrl: 'pages/characterResult.htm',
        controller: 'homeController'
    })
    
    .when('/realms', {
        templateUrl: 'pages/realms.htm',
        controller: 'realmController'
    })

    .when('/realms/', {
        templateUrl: 'pages/realms.htm',
        controller: 'realmController'
    })
    
    
    
});