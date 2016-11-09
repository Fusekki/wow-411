//CONTROLLERS

angular.module('wowApp')

.controller('homeCtrl', function () {
    
})


.controller('characterSearchCtrl', function ($scope, $location, sharedProperties, characterService, itemService, realmService, raceService, classService, bossService, zoneService) {
    

    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();

    // Build our sharedProperties information before the search.

    // Check for raceMap
    if (sharedProperties.getRaceStatus()) {
        console.log('they are defined');
    } else {
        // console.log('they are not defined');
        raceService.getRaces(function(response){
            // console.log(response.data)
            sharedProperties.setRaces(response.data.races);
            // console.log(sharedProperties.getRaceStatus());
        }, function(err) {
            console.log(err.status);
        });
    }

    // Check for classMap
    if (sharedProperties.getClassStatus()) {
        console.log('they are defined');
    } else {
        // console.log('they are not defined');
        classService.getClasses(function(response){
            // console.log(response.data);
            sharedProperties.setClasses(response.data.classes);
            // console.log(sharedProperties.getClassStatus());
        }, function(err) {
            console.log(err.status);
        });
    }

    if (sharedProperties.getBossStatus()) {
        console.log('they are defined');
    } else {
        // console.log('they are not defined');
        bossService.getBosses(function(response){
            // console.log(response.data);
            sharedProperties.setBosses(response.data.bosses);
            // console.log(sharedProperties.getBossStatus());
        }, function(err) {
            console.log(err.status);
        });
    }

    if (sharedProperties.getZoneStatus()) {
        console.log('zones are defined');
    } else {
        // console.log('zones are not defined');
        zoneService.getZones(function(response){
            // console.log(response.data);
            sharedProperties.setZones(response.data.zones);
            // console.log(sharedProperties.getZoneStatus());
        }, function(err) {
            console.log(err.status);
        });
    }



    $scope.selectedRealm = characterService.selectedRealm;
    
    // Populate the Realms drop down
    realmService.getRealms(function(response){
        // console.log(response.data);
        $scope.realmsResult = response.data;
    }, function(err) {
        console.log(err.status);

    });
//    $scope.realmsResult = realmService.GetRealms(this.region, this.keyValue);


    $scope.$watch('name', function () {
        characterService.name = $scope.name;
        itemService.name = $scope.name;
    });
    
    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
        itemService.selectedRealm = $scope.selectedRealm;
    });
    
    
    $scope.submit = function() {
        $location.path("/characterResult");
    };
    
})


// This is the controller for the realms page
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
    };

})

.controller('characterCtrl', function ($scope, $resource, $location, $http, sharedProperties, characterService, itemService) {
    
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

    $scope.$watch('showFeed', function() {
        $scope.buttonText = $scope.showFeed ? 'Hide' : 'Show';
    });

    // Character Feed call
    characterService.getCharacterFeed(function(response){

        $scope.characterResult = response.data;
        if (!race) {
            race = response.data.race;
        }
        thumbnail = response.data.thumbnail;

        // Set the background images
        $(".profile-wrapper").css("background", "url(http://render-api-us.worldofwarcraft.com/static-render/us/" + $scope.characterImage(thumbnail)+ ") no-repeat 182px 115px");

        // Set background image for profile based on race
        $(".content-top").css("background", "url(http://us.battle.net/wow/static/images/character/summary/backgrounds/race/" + race + ".jpg) left top no-repeat" );

        // Process through items in feed and determine the category each falls under.
        for (var x = 0; x <= response.data.feed.length - 1; x++) {
            var feedElement = {};
            if (response.data.feed[x].type === 'LOOT') {
                var itemElement = {};
                itemElement['index'] = x;
                itemElement['type'] = response.data.feed[x].type;
                itemElement['timestamp'] = response.data.feed[x].timestamp;
                itemElement['id'] = response.data.feed[x].itemId;
                // console.log(itemElement);
                items.push(itemElement);
                count++;

                // Perform a call to the item service for further details on the loot.
                feedElement = callItemService(itemElement);
                // console.log(feedElement);
                feedElement['type'] = itemElement['type'];
                feedElement['timestamp'] = itemElement['timestamp'];
                // console.log(feedElement);
                // console.log(self.feed);
                self.feed.splice(items[idx].index, 0, feedElement);
                // console.log(self.feed);
                // var i = items[idx].index;
                // console.log(i);

                idx++;
            } else if (response.data.feed[x].type === 'BOSSKILL') {
                // console.log('in boss');
                feedElement['timestamp'] = response.data.feed[x].timestamp;
                feedElement['type'] = response.data.feed[x].type;
                // do something else
                feedElement['name'] = response.data.feed[x].name;
                feedElement['icon'] = response.data.feed[x].achievement.icon;
                feedElement['title'] = response.data.feed[x].achievement.title;
                feedElement['quantity'] = response.data.feed[x].quantity;
                feedElement['id'] = response.data.feed[x].criteria.id;
                if (response.data.feed[x].name) {
                    feedElement['tooltip'] = "BOSS-YES";
                } else {
                    feedElement['tooltip'] = "BOSS-NO";
                }

                self.feed.push(feedElement);

                // console.log(feedElement);
            } else if (response.data.feed[x].type === 'ACHIEVEMENT') {
                // console.log('in achievement');
                // console.log(feedElement);
                feedElement['timestamp'] = response.data.feed[x].timestamp;
                feedElement['type'] = response.data.feed[x].type;
                // console.log(response.data.feed[x].type);
                // console.log(feedElement);
                feedElement['title'] = response.data.feed[x].achievement.title;

                // console.log(feedElement);
                feedElement['description'] = response.data.feed[x].achievement.description;

                // console.log(feedElement);
                feedElement['icon'] = response.data.feed[x].achievement.icon;
                feedElement['tooltip'] = "ACHIEVEMENT";
                // console.log(feedElement);
                self.feed.push(feedElement);
            }
        }
        $scope.list = self.feed;
        // console.log($scope.list);
    }, function(err) {
        console.log(err.status);

    });

    callItemService = function(itemElement) {
        var item = {};
        // console.log(itemElement);
        // console.log(itemElement.id);

        itemService.getItem(itemElement.id, function (response) {

            item['name'] = response.data.name;
            item['icon'] = response.data.icon;
            item['armor'] = response.data.armor;
            item['bonusStats'] = response.data.bonusStats;
            item['buyPrice'] = response.data.buyPrice;
            item['requiredLevel'] = response.data.requiredLevel;
            if (response.data.socketInfo) {
                item['socketInfo'] = response.data.socketInfo;
            }
            item['upgradable'] = response.data.upgradable;
            item['itemLevel'] = response.data.itemLevel;
            item['itemBind'] = response.data.itemBind;
            item['itemClass'] = response.data.itemClass;
            item['maxDurability'] = response.data.maxDurability;
            item['sellPrice'] = response.data.sellPrice;
            item['quality'] = response.data.quality;
            // console.log(item);

            return item;
        }, function (err) {
            console.log(err.status);
        });
        // console.log(item);
        return item;
    };

    // This is the API call for the character Items.  This call populates the inventory slots.
    characterService.getItem(function(response){
        // console.log(response);
        var slots = sharedProperties.getInventorySlots();


        for (var x = 0; x < slots.length; x++) {
            // Map the items here before you push them.

            var inventorySlot = {};

            inventorySlot['name'] = slots[x];
            inventorySlot['value'] = response.data.items[slots[x]];
            inventorySlot['slot'] = sharedProperties.getInventorySlot(slots[x]);
            inventorySlot['bonusStats'] =  [];
            inventorySlot['id'] = response.data.items[slots[x]].id;

            self.inventorySlots.push(inventorySlot);

            if (slots[x] in response.data.items) {
                var inventoryElement = {};
                // console.log('key exists.');
                inventoryElement = callItemService(inventorySlot);
                inventoryElement['slot'] = slots[x];
                // console.log(inventoryElement);
                self.inventoryArray.push(inventoryElement);
            } else {
                console.log('key does not exist. Moving on to next item.');
            }
        }
        // console.log('here');

        // Locate the item in the inventorySlots array by searching for the name in inventorySlots and matching it to the 'slot' field in inventoryArray.

        self.inventorySlots.forEach( function (arrayItem) {
            console.log(arrayItem);
        });

        self.inventoryArray.forEach( function (arrayItem) {
            console.log(arrayItem);
        });



        // Add additional fields to array


        // Need to map this with an internal values associating
        // console.log(self.inventorySlots);

        // This sorts the array by slot name (head, shoulders, finger, etc).
        $scope.inventory = self.inventorySlots.sort(function(a,b) {
            return a.slot - b.slot;
        });
         console.log($scope.inventory);


        //$scope.inventory = self.inventorySlots;

    }, function(err) {
        console.log(err.status);

    });


    $scope.name = characterService.name;
    $scope.selectedRealm = characterService.selectedRealm;

    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
    });

    
    $scope.classMap = function(idx) {
        return sharedProperties.getClass(idx);
    };
    $scope.bossMap = function(idx) {
        // console.log(sharedProperties.getRace(idx));
        var test = sharedProperties.getBoss(idx.name);
        if (test.name) {
            $scope.boss = sharedProperties.getBoss(idx.name);
        } else {
            idx.tooltip = "BOSS-NO";
        }

        // console.log($scope.boss);
    };

    $scope.zoneMap = function(zoneId) {
        // console.log(sharedProperties.getRace(idx));
        // console.log(zoneId);
        var zone = sharedProperties.getZone(zoneId);
        return zone;
    };
    
    $scope.raceMap = function(idx) {
        // console.log(sharedProperties.getRace(idx));
        return sharedProperties.getRace(idx);


    };
    $scope.factionMap = function(idx) {
        return sharedProperties.getFaction(idx);
    };
    $scope.genderMap = function(idx) {
        return sharedProperties.getGender(idx);
    };

    $scope.itemqualityMap = function(idx) {
        return sharedProperties.getItemQuality(idx);
    };

    $scope.itemupgradableMap = function(idx) {
        return sharedProperties.getItemUpgradable(idx);
    };

    $scope.itembindMap = function(idx) {
        return sharedProperties.getItemBind(idx);
    };

    $scope.bonusstatsParse = function(item) {
        // var totalString = "";
        return sharedProperties.getBonusstatsparse(item);
        // console.log(totalString);
        // return totalString;
        // return sharedProperties.getBonusstatsparse(idx);
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
        return sharedProperties.getGold(sellValue);
    };



    $scope.$watch('name', function () {
        characterService.name = $scope.name;
    });
    
    $scope.$watch('selectedRealm', function () {
        characterService.selectedRealm = $scope.selectedRealm;
    });
    

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



});