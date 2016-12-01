//CONTROLLERS

angular.module('wowApp')

    .controller('homeCtrl', function () {



    })


    .controller('characterSearchCtrl', function ($scope, $location, $cacheFactory, characterFeed, myCache, characterService, itemService, realmService) {
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
        };

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

    .controller('characterCtrl', function ($scope, $sce, $resource, $location, $http, characterFeed, characterService, itemService) {

        var self = this;

        self.feed = [];
        self.filteredFeed = [];
        self.inventorySlots = [];
        self.inventoryArray = [];

        var items = [];
        var count = 0;
        var idx = 0;
        var race;
        var thumbnail;

        $scope.show = false;

        $scope.searchFeed = '';
        $scope.sortType = 'name';
        $scope.sortReverse = false;
        $scope.showFeed = true;

        $scope.showInfobox = false;


        // Populate realmsResult with cached items (if there are any).
        $scope.realmsResult = characterFeed.getCacheItems("realms");

        // This sets the service to assign the variable .name to whatever the user enters into the htm entry.
        $scope.$watch('name', function () {
            characterService.name = $scope.name;
        });

        // This sets the service to assign the variable .selectedRealm to whatever the user enters into the htm entry.
        $scope.$watch('selectedRealm', function () {
            characterService.selectedRealm = $scope.selectedRealm;
        });


        $scope.$watch('showFeed', function() {
            $scope.buttonText = $scope.showFeed ? 'Hide' : 'Show';
        });
        // console.log('test');


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

        // Character Feed call.  This occurs when the controller is active.
        // characterService.getCharacterFeed();
        $scope.list = characterService.checkCharacterFeed();


        // callItemService = function(itemElement) {
        //     console.log('Get Item API Wrapper call.');
        //
        //     var item = {};
        //
        //     itemService.getItem(itemElement.id, function (response) {
        //         item['name'] = response.data.name;
        //         item['icon'] = response.data.icon;
        //         item['armor'] = response.data.armor;
        //         item['bonusStats'] = response.data.bonusStats;
        //         item['buyPrice'] = response.data.buyPrice;
        //         item['requiredLevel'] = response.data.requiredLevel;
        //         if (response.data.socketInfo) {
        //             item['socketInfo'] = response.data.socketInfo;
        //         }
        //         item['upgradable'] = response.data.upgradable;
        //         item['itemLevel'] = response.data.itemLevel;
        //         item['itemBind'] = response.data.itemBind;
        //         item['itemClass'] = response.data.itemClass;
        //         item['maxDurability'] = response.data.maxDurability;
        //         item['sellPrice'] = response.data.sellPrice;
        //         item['quality'] = response.data.quality;
        //     }, function (err) {
        //         console.log(err.status);
        //     });
        //     return item;
        // };

        // This is the API call for the character Items.  This call populates the inventory slots.

        // characterService.getItem(function(response){
        //     console.log('Get Item API Call.');
        //     // console.log('in getItem service');
        //     var slots = characterFeed.getInventorySlots();
        //
        //     for (var x = 0; x < slots.length; x++) {
        //         // Map the items here before you push them.
        //
        //         var inventorySlot = {};
        //         // console.log('creating inventorySlot');
        //
        //         inventorySlot['name'] = slots[x];
        //         inventorySlot['value'] = response.data.items[slots[x]];
        //         // console.log(response.data.items[slots[x]]);
        //         inventorySlot['slot'] = characterFeed.getInventorySlot(slots[x]);
        //         inventorySlot['bonusStats'] =  [];
        //         inventorySlot['id'] = response.data.items[slots[x]].id;
        //         // console.log('adding inventorySlot item to inventorySlots array.');
        //         // console.log(inventorySlot);
        //         // console.log(inventorySlot.value.armor);
        //
        //         self.inventorySlots.push(inventorySlot);
        //
        //         if (slots[x] in response.data.items) {
        //             var inventoryElement = {};
        //             // console.log('calling callItemService from  within getItem');
        //             // console.log(inventorySlot);
        //             console.log('invoking call item service for the items inventory slots on item:');
        //             console.log(inventorySlot);
        //
        //             inventoryElement = callItemService(inventorySlot);
        //
        //
        //             inventoryElement['slot'] = slots[x];
        //             // console.log(inventoryElement);
        //             self.inventoryArray.push(inventoryElement);
        //         } else {
        //             console.log('key does not exist. Moving on to next item.');
        //         }
        //     }
        //
        //
        //     $scope.inventory = self.inventoryArray.sort(function(a,b) {
        //         console.log('sort inventory items');
        //         return characterFeed.getInventorySlot(a.slot) - characterFeed.getInventorySlot(b.slot);
        //     });
        //
        //
        // }, function(err) {
        //     console.log(err.status);
        //
        // });

        $scope.name = characterService.name;
        $scope.selectedRealm = characterService.selectedRealm;


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
    })

    .filter('unsafe', function($sce) {
        return $sce.trustAsHtml;
    });