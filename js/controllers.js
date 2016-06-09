//CONTROLLERS


wowApp.controller('homeController', ['$scope', '$location', 'characterService', 'realmService', function ($scope, $location, characterService, realmService) {
    
    $scope.region = "en_US";
    $scope.privateKey = "jnfn9kb9a7pwgu327xq4exbedxjnzyxr";
    $scope.realmsResult = realmService.GetRealms($scope.region, $scope.privateKey);
    $scope.name = characterService.name;
    $scope.selectedRealm = characterService.selectedRealm;
    
    
    $scope.$watch('name', function () {
        characterService.name = $scope.name;
    })
    
    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
    })
    
    
    $scope.submit = function() {
        $location.path("/characterResult");
        console.log($scope.selectedRealm);
        console.log($scope.name);
    }
    
}]);



wowApp.controller('realmController', ['$scope', '$resource', 'realmService', function ($scope, $resource, realmService) {
    
    $scope.region = "en_US";
    $scope.privateKey = "jnfn9kb9a7pwgu327xq4exbedxjnzyxr";
    $scope.realmsResult = realmService.GetRealms($scope.region, $scope.privateKey);
    
//    console.log(window.sessionStorage);
//    
//    if (typeof(window.Storage))  {
//        console.log('storage available.');
//        if (sessionStorage.realms) {
//            console.log('realms is already created');
//            $scope.realmsResult = sessionStorage.realms;
//            console.log(sessionStorage.realms);
//
//        } else {
//            console.log('realms is not created.');
//            $scope.realmsResult = realmService.GetRealms($scope.region, $scope.privateKey);
//            sessionStorage.setItem('realms', $scope.realmsResult);
//            console.log(sessionStorage['realms']);
//        }
//    } else {
//        console.log('Sorry, no storage is available.');
//        $scope.realmsResult = realmService.GetRealms($scope.region, $scope.privateKey);
//    }
    
    

    
    $scope.sortType = 'name';
    $scope.sortReverse = false;
    $scope.searchRealms = '';
    
    $scope.sliceCountryFromTimezone = function(timezone) {
        var idx = timezone.indexOf("/");
        return timezone.slice(idx + 1).replace(/_/g," ");
    }
    

}]);

wowApp.controller('characterController', ['$scope', '$resource', '$location', 'characterService', 'realmService', function ($scope, $resource, $location, characterService, realmService) {
    
    $scope.region = "en_US";
    $scope.privateKey = "jnfn9kb9a7pwgu327xq4exbedxjnzyxr";
    $scope.name = characterService.name;
    $scope.selectedRealm = characterService.selectedRealm;
    $scope.characterResult = characterService.GetCharacter($scope.region, $scope.privateKey, $scope.name, $scope.selectedRealm);
    
    console.log($scope.characterResult);
    
    console.log($scope.privateKey);
    $scope.$watch('name', function () {
        characterService.name = $scope.name;
    })
    
    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
    })
    
    $scope.classMap = ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Death Knight", "Shaman", "Mage", "Warlock", "Monk", "Druid"];
    $scope.genderMap = ["Male", "Female"];
    $scope.raceMap = {  1 : "Human",
                        2: "Orc",
                        3: "Dwarf",
                        4: "Night Elf",
                        5: "Undead",
                        6: "Tauren",
                        7: "Gnome",
                        8: "Troll",
                        9: "Goblin",
                        10: "Bloodelf", 
                        11: "Draenei",
                        22: "Worgen",
                        24: "Pandaren - Neutral",
                        25: "Pandaren - Alliance",
                        26: "Pandaren - Horde" };   
    $scope.factionMap = ["Alliance", "Horde"];
    
    $scope.convertToStandard = function(lastModified) {
      return new Date(lastModified).toUTCString();
    };
}]);