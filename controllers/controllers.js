//CONTROLLERS

angular.module('wowApp')

    .controller('homeCtrl', function () {



    })

    // This is the controller for the realms page
    .controller('realmCtrl', function ($scope, characterFeed) {


        // First check the Realms cache to see if the API needs to be called.
        characterFeed.initRealms();

        // Populate realmsResult with cached items (if there are any).
        $scope.realmsResult = characterFeed.getCacheItems("realms");

        $scope.$on('realms_update', function() {
            console.log('here');
            $scope.realmsResult = characterFeed.getCacheItems("realms");
        });

        $scope.sortType = 'name';
        $scope.sortReverse = false;
        $scope.searchRealms = '';
        // console.log($scope.searchRealms);


        $scope.sliceCountryFromTimezone = function(timezone) {
            var idx = timezone.indexOf("/");
            return timezone.slice(idx + 1).replace(/_/g," ");
        };

    })


    .controller('characterSearchCtrl', function ($scope, $location, characterFeed, characterService, itemService) {
        // Start the characterFeed service.  This is going to check/populate races, classes, bosses, and zones.

        // myCache.put('key', 'value');
        // console.log(myCache.get('key'));
        // var cache = myCache;
        //
        // if (cache) { // If there’s something in the cache, use it!
        //     $scope.variable = cache;
        // } else { // Otherwise, let’s generate a new instance
        //     cache.put(‘myData’, 'This is cached data!');
        //     $scope.variable = myCache.get('myData');
        // }

        // First check what API calls need to be performed and call them if cache items are not present.
        characterFeed.init();

        // Populate realmsResult with cached items (if there are any).
        $scope.realmsResult = characterFeed.getCacheItems("realms");



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
            $scope.realmsResult = characterFeed.getCacheItems("realms");
        });

        $scope.submit = function() {
            $location.path("/characterResult");
            // console.log('button pressed');
        };

    })


    .controller('characterCtrl', function ($scope, $sce, $resource, $location, $http, characterFeed, characterService, itemService) {


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
        $scope.realmsResult = characterFeed.getCacheItems("realms");

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
            // console.log($scope.name);
            // console.log($scope.selectedRealm);
            // console.log($scope.list);
        });

        $scope.$on('inventory_retrieved', function() {
            console.log('broadcast received for inventory');
            console.log('list before retrieve:');
            console.log($scope.inventory);


            $scope.inventory = characterService.getCacheItems('Inv:' + $scope.name.toLowerCase() + ':' + $scope.selectedRealm);
            console.log($scope.inventory);

        });

        // This kicks things off.
        characterService.init();

        // These are used for the tooltips.  They work with $sce to sanitize the dynamic html so that it is rendered properly.
        // If item is passed via Inventory Tooltip, it will pass a number.  If item is passed via feed Tooltip, it will pass an object.

        $scope.calcGold = function (idx) {
            // console.log(typeof idx);
            // console.log(idx);
            if (typeof idx == 'number') {
                return "Sell Price: " + $scope.convertGold($scope.inventory[idx].sellPrice);
            }
                return $scope.convertGold(idx.sellPrice);
        };

        $scope.calcStats =  function (idx) {
            // console.log(typeof idx);
            // console.log(idx);
            if (typeof idx == 'number') {
                // console.log('here');
                // console.log(idx);
                // console.log($scope.inventory[idx].bonusStats);
                return $scope.bonusstatsParse($scope.inventory[idx].bonusStats);
            }
                return $scope.bonusstatsParse(idx);
        };

        // Set tooltips for feed and inventory areas.
        $(document).ready(function () {

            //Tooltip, activated by hover event
            $("#table-feed").tooltip({
                selector: "[data-toggle='tooltip']",
                container: "#table-feed",
                html: true
            });

            $("#summary-inventory").tooltip({
                selector: "[data-toggle='tooltip']",
                container: "#summary-inventory",
                html: true
            });


        });

        $scope.showinfo = function(feedItem, bool) {
            if(bool === true) {
                $scope.showInfobox = true;
                // $scope.personColour = {color: '#'+person.colour};
                // console.log(feedItem);
                console.log('mouse enter for');
            } else if (bool === false) {
                $scope.showInfobox = false;
                // $scope.personColour = {color: 'white'}; //or, whatever the original color is
                console.log(feedItem);
                console.log('mouse leave for');
            }
        };

        $scope.classMap = function(idx) {
            return characterFeed.getClass(idx);
        };
        $scope.bossMap = function(idx) {
            // console.log(characterFeed.getRace(idx));
            var test = characterFeed.getBoss(idx.name);
            if (test.name) {
                $scope.boss = characterFeed.getBoss(idx.name);
            } else {
                idx.tooltip = "BOSS-NO";
            }

            // console.log($scope.boss);
        };

        $scope.zoneMap = function(zoneId) {
            // console.log(characterFeed.getRace(idx));
            // console.log(zoneId);
            var zone = characterFeed.getZone(zoneId);
            return zone;
        };

        $scope.raceMap = function(idx) {
            // console.log(characterFeed.getRace(idx));
            return characterFeed.getRace(idx);


        };
        $scope.factionMap = function(idx) {
            return characterFeed.getFaction(idx);
        };
        $scope.genderMap = function(idx) {
            return characterFeed.getGender(idx);
        };

        $scope.itemqualityMap = function(idx) {
            return characterFeed.getItemQuality(idx);
        };

        $scope.itemupgradableMap = function(idx) {
            return characterFeed.getItemUpgradable(idx);
        };

        $scope.itembindMap = function(idx) {
            return characterFeed.getItemBind(idx);
        };

        $scope.bonusstatsParse = function(item) {
            if (item) {
                return characterFeed.getBonusstatsparse(item);
            }
        };

        $scope.characterImage = function(path) {
            // console.log(path);
            var imagePath = path.substr(0, path.indexOf('avatar.jpg'));
            // console.log(imagePath);
            imagePath += "profilemain.jpg";
            // console.log(imagePath);
            return imagePath;
        };



        $scope.convertGold = function(sellValue) {
            // return characterFeed.getGold(sellValue);
            return characterFeed.getGold(sellValue);
        };



        $scope.convertToStandard = function(lastModified) {
            return new Date(lastModified).toUTCString();
        };

        $scope.nameFromtitle = function(title) {
            console.log(title);
            console.log($scope.bossMap(title.substr(0, title.indexOf(' '))));
            var bossName = title.substr(0, title.indexOf(' ')).toLowerCase();
            console.log(bossName);
            console.log($scope.bossMap(bossName));
            return $scope.bossMap(bossName);
        };

        $scope.capitalizeName = function(name) {
            console.log(name);
            return name.charAt(0).toUpperCase() + name.slice(1);
        };

    })

    .filter('unsafe', function($sce) {
        return $sce.trustAsHtml;
    });