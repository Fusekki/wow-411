//CONTROLLERS

angular.module('wowApp')

    .controller('homeCtrl', function ($scope, backgroundService) {
        console.log('here');
        $scope.backgroundService = backgroundService;
        backgroundService.setCurrentBg("home_bg");
    })

    // This is the controller for the realms page
    .controller('realmCtrl', function ($scope, searchService, backgroundService) {

        $scope.backgroundService = backgroundService;
        backgroundService.setCurrentBg("home_bg");

        $scope.sortType = 'name';
        $scope.sortReverse = false;
        $scope.searchRealms = '';

        $scope.region = "US/North America";

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


    .controller('searchCtrl', function ($scope, $location, searchService, characterService, itemService, backgroundService) {


        backgroundService.setCurrentBg("home_bg");

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

        $scope.choose_character_one = function() {
            // console.log('clicked');
            $scope.name = "leouric";
            $scope.selectedRealm = "Emerald Dream";
            $location.path("/characterResult");

        };

        $scope.choose_character = function(name, realm) {
            // console.log('clicked');
            $scope.name = name;
            $scope.selectedRealm = realm;
            $location.path("/characterResult");

        };

    })

    .controller('characterCtrl', function ($scope, $sce, $resource, $location, $http, searchService, characterService, backgroundService) {


        backgroundService.setCurrentBg("char_bg");
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
            // Set the background following the cache success.
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

        $scope.zoneMap = function(zoneId) {
            return searchService.getZone(zoneId);
        };


        $scope.raceMap = function(idx) {
            return searchService.getRace(idx);


        };
        $scope.factionMap = function(idx) {
            return searchService.getFaction(idx);
        };
        $scope.genderMap = function(idx) {
            return searchService.getGender(idx);
        };

        $scope.itemupgradableMap = function(idx) {
            return searchService.getItemUpgradable(idx);
        };

        $scope.itembindMap = function(idx) {
            return searchService.getItemBind(idx);
        };

        $scope.convertToStandard = function(lastModified) {
            return new Date(lastModified).toLocaleString();
        };

        $scope.convertToLocal = function(lastModified) {
            return new Date(lastModified).toLocaleString().replace(/(.*)\D\d+/, '$1');
        };

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