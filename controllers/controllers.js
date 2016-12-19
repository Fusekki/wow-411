//CONTROLLERS

angular.module('wowApp')

    .controller('homeCtrl', function () {
    })

    // This is the controller for the realms page
    .controller('realmCtrl', function ($scope, searchService) {

        $scope.sortType = 'name';
        $scope.sortReverse = false;
        $scope.searchRealms = '';

        // First check the Realms cache to see if the API needs to be called.
        searchService.initRealms();

        // Populate realmsResult with cached items (if there are any).
        $scope.realmsResult = searchService.getCacheItems("realms");

        $scope.$on('realms_update', function() {
            $scope.realmsResult = searchService.getCacheItems("realms");
        });


        $scope.sliceCountryFromTimezone = function(timezone) {
            var idx = timezone.indexOf("/");
            return timezone.slice(idx + 1).replace(/_/g," ");
        };
    })


    .controller('searchCtrl', function ($scope, $location, searchService, characterService, itemService) {
        // Start the searchService service.  This is going to check/populate races, classes, bosses, and zones.

        // First check what API calls need to be performed and call them if cache items are not present.
        searchService.init();

        // Populate realmsResult with cached items (if there are any).
        $scope.realmsResult = searchService.getCacheItems("realms");

        $scope.selectedRealm = characterService.selectedRealm;

        $scope.$watch('name', function () {
            characterService.name = $scope.name;
            itemService.name = $scope.name;
        });

        $scope.$watch('selectedRealm', function () {
            characterService.selectedRealm = $scope.selectedRealm;
            itemService.selectedRealm = $scope.selectedRealm;
        });


        $scope.$on('realms_update', function() {
            $scope.realmsResult = searchService.getCacheItems("realms");
        });

        $scope.submit = function() {
            $location.path("/characterResult");
        };

    })

    .controller('characterCtrl', function ($scope, $sce, $resource, $location, $http, searchService, characterService, itemService) {

        var self = this;

        self.feed = [];
        self.filteredFeed = [];
        self.inventorySlots = [];
        self.inventoryArray = [];

        $scope.show = false;

        $scope.searchFeed = '';
        $scope.sortType = 'name';
        $scope.sortReverse = false;
        $scope.showFeed = true;

        $scope.showInfobox = false;

        $scope.name = characterService.name;
        $scope.selectedRealm = characterService.selectedRealm;


        // Populate realmsResult with cached items (if there are any).
        $scope.realmsResult = searchService.getCacheItems("realms");

        $scope.$watch('showFeed', function() {
            $scope.buttonText = $scope.showFeed ? 'Hide' : 'Show';
        });


        $scope.$on('character_retrieved', function() {
            console.log('broadcast received');
            $scope.characterResult = characterService.getCacheItems('Char:' + $scope.name.toLowerCase() + ':' + $scope.selectedRealm);
            // Set the bavkground following the cache success.
            characterService.setBackground($scope.characterResult.background, $scope.characterResult.backgroundImg);
        });

        $scope.$on('feed_retrieved', function() {
            console.log('feed broadcast received');
            $scope.list = characterService.getCacheItems('Feed:' + $scope.name.toLowerCase() + ':' + $scope.selectedRealm);
        });

        $scope.$on('inventory_retrieved', function() {
            console.log('broadcast received for inventory');
            $scope.inventory = characterService.getCacheItems('Inv:' + $scope.name.toLowerCase() + ':' + $scope.selectedRealm);
        });


        $scope.$on('achievements_retrieved', function() {
            console.log('achievements broadcast received');
            $scope.ach = characterService.getCacheItems('Ach');
        });


        // This kicks things off.
        characterService.init();

        // These are used for the tooltips.  They work with $sce to sanitize the dynamic html so that it is rendered properly.
        // If item is passed via Inventory Tooltip, it will pass a number.  If item is passed via feed Tooltip, it will pass an object.

        $scope.calcGold = function (idx) {
            if (typeof idx != 'undefined') {
                return "Sell Price: " + searchService.getGold($scope.inventory[idx].sellPrice)
            }
            return null;
        };

        $scope.calcStats =  function (idx) {
            if (typeof idx !== 'undefined') {
                if ($scope.inventory[idx].bonusStats) {
                    return searchService.getBonusstatsparse($scope.inventory[idx].bonusStats);
                }
            }
            return null;
        };

        $scope.calcArmor =  function (value) {
            return characterService.getArmorValue(value);
        };

        $scope.calcLevel =  function (value) {
            return characterService.getLevelValue(value);
        };

        // $scope.showinfo = function(feedItem, bool) {
        //     if(bool === true) {
        //         $scope.showInfobox = true;
        //         console.log('mouse enter for');
        //     } else if (bool === false) {
        //         $scope.showInfobox = false;
        //         console.log(feedItem);
        //         console.log('mouse leave for');
        //     }
        // };

        $scope.classMap = function(idx) {
            return searchService.getClass(idx);
        };
        $scope.bossMap = function(item) {
            if (item.name) {
                $scope.boss = searchService.getBoss(item.name);
            }   else {
                item.tooltip = "BOSS-NO";
            }
        };

        // $scope.zoneMap = function(zoneId) {
        //     return searchService.getZone(zoneId);
        // };

        $scope.raceMap = function(idx) {
            return searchService.getRace(idx);


        };
        $scope.factionMap = function(idx) {
            return searchService.getFaction(idx);
        };
        $scope.genderMap = function(idx) {
            return searchService.getGender(idx);
        };

        // $scope.itemqualityMap = function(idx) {
        //     return searchService.getItemQuality(idx);
        // };

        $scope.itemupgradableMap = function(idx) {
            return searchService.getItemUpgradable(idx);
        };

        $scope.itembindMap = function(idx) {
            return searchService.getItemBind(idx);
        };

        // $scope.characterImage = function(path) {
        //     var imagePath = path.substr(0, path.indexOf('avatar.jpg'));
        //     imagePath += "profilemain.jpg";
        //     return imagePath;
        // };



        //  var convertGold = function(sellValue) {
        //     return searchService.getGold(sellValue);
        // };



        $scope.convertToStandard = function(lastModified) {
            return new Date(lastModified).toUTCString();
        };

        // $scope.nameFromtitle = function(title) {
        //     console.log(title);
        //     console.log($scope.bossMap(title.substr(0, title.indexOf(' '))));
        //     var bossName = title.substr(0, title.indexOf(' ')).toLowerCase();
        //     console.log(bossName);
        //     console.log($scope.bossMap(bossName));
        //     return $scope.bossMap(bossName);
        // };

        $scope.capitalizeName = function(name) {
            if (name) {
                switch (name) {
                    case 'offHand':
                        return 'Off Hand';
                        break;
                    case 'mainHand':
                        return 'Main Hand';
                        break;
                    default:
                        var withNoDigits = name.replace(/[0-9]/g, '');
                        return withNoDigits.charAt(0).toUpperCase() + withNoDigits.slice(1);
                }
            }
            return "";
        };

    })

    .filter('unsafe', function($sce) {
        return $sce.trustAsHtml;
    });