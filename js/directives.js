//DIRECTIVES

angular.module('wowApp')

.directive("realmReport", function() {
    return {
        templateUrl: 'directives/realmReport.html',
        controller: 'realmController',
        replace: true
    }
})