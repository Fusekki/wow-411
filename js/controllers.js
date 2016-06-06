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



wowApp.controller('realmController', ['$scope', '$resource', 'realmService', function ($scope, $resource, realmService) {
    
    $scope.region = "en_US";
    $scope.privateKey = "jnfn9kb9a7pwgu327xq4exbedxjnzyxr";
    $scope.realmsResult = realmService.GetRealms($scope.region, $scope.privateKey);
    
    $scope.sortType = 'name';
    $scope.sortReverse = false;
    $scope.searchRealms = '';

}]);