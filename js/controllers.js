//CONTROLLERS


wowApp.controller('homeController', ['$scope', '$location', 'characterService', function ($scope, $location, characterService) {
    
    $scope.name = characterService.name;
    console.log(characterService.name);
    
    $scope.$watch('name', function () {
        characterService.name = $scope.name;
    })
    
    $scope.submit = function() {
        $location.path("/characterSearch");
    }
    
}]);