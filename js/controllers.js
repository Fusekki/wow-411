//CONTROLLERS

angular.module('wowApp')

.controller('homeCtrl', function () {
    
})


.controller('characterSearchCtrl', function ($scope, $location, sharedProperties, characterService, realmService) {
    

    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();
    
    $scope.selectedRealm = characterService.selectedRealm;
    
    // Populate the Realms drop down
    realmService.getRealms(function(response){
        console.log(response.data);
        $scope.realmsResult = response.data;
    }, function(err) {
        console.log(err.status);

    });
//    $scope.realmsResult = realmService.GetRealms(this.region, this.keyValue);
    
    
    
    console.log(characterService.name);
    
    $scope.$watch('name', function () {
        characterService.name = $scope.name;
    })
    
    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
    })
    
    
    $scope.submit = function() {
        $location.path("/characterResult");
    }
    
})



.controller('realmCtrl', function ($scope, sharedProperties, realmService) {
    
    $scope.keyValue = sharedProperties.getPrivateKey();
    $scope.region = sharedProperties.getRegion();
//    $scope.realmsResult = realmService.GetRealms($scope.region, $scope.keyValue);
    realmService.getRealms(function(response){
        console.log(response.data);
        $scope.realmsResult = response.data;
    }, function(err) {
        console.log(err.status);

    });
    
    $scope.sortType = 'name';
    $scope.sortReverse = false;
    $scope.searchRealms = '';
    
    $scope.sliceCountryFromTimezone = function(timezone) {
        var idx = timezone.indexOf("/");
        return timezone.slice(idx + 1).replace(/_/g," ");
    }
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
    

})

.controller('characterCtrl', function ($scope, $resource, $location, $http, sharedProperties, characterService, realmService) {
    
    var self = this;
    


    // characterService.getCharacter(function(response){
    //     console.log(response.data);
    //     $scope.characterResult = response.data;
    // }, function(err) {
    //     console.log(err.status);
    //
    // });

    characterService.getCharacterFeed(function(response){
        console.log(response.data);
        $scope.characterResult = response.data;
    }, function(err) {
        console.log(err.status);

    });


    // characterService.getItem(itemId, function (response) {
    //     console.log(response.data);
    // }, function (err) {
    //     console.log(err.status);
    // });


    // var retrieveItem = characterService.getItem(itemId, function (response) {
    //     console.log(response.data);
    // }, function (err) {
    //     console.log(err.status);
    // });
    // characterService.getAchievements(function(response){
    //     console.log(response.data);
    //     var achievements = response.data.achievements.achievementsCompleted;
    //
    //     achievements.forEach(function(entry) {
    //         self.ach.unshift(entry);
    //     })
    //     console.log(self.ach);
    //     self.ach = self.ach.slice(self.ach.length - 10);
    //     // Call the Achievements API
    //     for (var x = 0; x <= self.ach.length - 1; x++) {
    //         console.log(self.ach.length);
    //
    //         characterService.getAchievementDetails(self.ach[x], function(response){
    //             console.log(response.data);
    //             $scope.achDetails.unshift(response.data.title);
    //
    //             $scope.achDetails.forEach(function(entry) {
    //                 console.log(entry);
    //             })
    //         }, function(err) {
    //             console.log(err.status);
    //
    //         });
    //
    //     }
    // }, function(err) {
    //     console.log(err.status);
    //
    // });


    

    $scope.name = characterService.name;
    $scope.selectedRealm = characterService.selectedRealm;
    
    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
    })
    
    
    $scope.classMap = function(idx) {
        return sharedProperties.getClass(idx);
    }
    
    $scope.raceMap = function(idx) {
        return sharedProperties.getRace(idx);
    }
    $scope.factionMap = function(idx) {
        return sharedProperties.getFaction(idx);
    }
    $scope.genderMap = function(idx) {
        return sharedProperties.getGender(idx);
    }

    $scope.$watch('name', function () {
        characterService.name = $scope.name;
    })
    
    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
    })
    
    // $scope.submit = function() {
    //     $location.path("/characterResult");
    //     console.log($scope.selectedRealm);
    //     console.log($scope.name);
    // }

    
    $scope.convertToStandard = function(lastModified) {
      return new Date(lastModified).toUTCString();
    };
});