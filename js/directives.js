//DIRECTIVES

angular.module('wowApp')

.directive("realmReport", function() {
    return {
        templateUrl: 'directives/realmReport.html',
        controller: 'realmController',
        replace: true
    }
})

.directive("itemTooltip", function() {
    return {
        templateUrl: 'directives/itemTooltip.html',
        controller: 'characterCtrl',
        replace: true
    }
})

.directive("feedTooltip", function() {
    return {
        template: ' {{ feedItem.name }} <br> Acquired: {{ convertToStandard(feedItem.timestamp) }} <br> {{ feedItem.name  || feedItem.title }}',
        controller: 'characterCtrl',
        replace: true
    }
})