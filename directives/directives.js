//DIRECTIVES

angular.module('wowApp')


.directive("feedTable", function() {
    return {
        templateUrl: 'templates/feedTable.htm',
        replace: true
    };
})


.directive("inventoryItem", function() {
    return {
        templateUrl: 'templates/inventoryItem.htm',
        // controller: 'characterCtrl',
        replace: true
    };
})



// .directive("feedTooltip", function() {
//     return {
//         template: ' {{ feedItem.name }} <br> Acquired: {{ convertToStandard(feedItem.timestamp) }} <br> {{ feedItem.name  || feedItem.title }}',
//         controller: 'characterCtrl',
//         replace: true
//     }
// })


.filter('html', function(sce$) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

