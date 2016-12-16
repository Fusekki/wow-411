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
        replace: true
    };
})

.filter('html', function(sce$) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

