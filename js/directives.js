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

// .directive("bossTooltip", function() {
//     return {
//         template: 'directives/boss-tooltip.html',
//         controller: 'characterCtrl',
//         replace: true
//     }
// })

.directive('bossTooltip', function() {
    return {
        controller: function($scope, $element) {
            $scope.isShown = false;
            this.showHover = function() {
                $scope.isShown = $scope.isShown == true ? false : true;
            }
        },
        transclude: true,
        link: function(scope, element, attr, ctrl) {
            element.bind('click', function() {
                scope.$apply(function() {
                    ctrl.showHover();
                });
            });
        },
        template: '<div ng-transclude></div>' +
        '<div id="divPopup" ng-show="isShown">' +
        '<div class="floatLeft">' +
        '<img src="images/tooltipArrow.png" />' +
        '</div>' +
        '<div class="floatLeft margin3">' +
        '<span>' +
        'I am the Hover Popup' +
        '</span>' +
        '</div>' +
        '</div>'
    }
})