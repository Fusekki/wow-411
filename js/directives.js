//DIRECTIVES

wowApp.directive("realmReport", function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/realmReport.html',
        replace: true
//        scope: {
//            realmName: "="      
//        }   
    }
});