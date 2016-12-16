//SERVICES

angular.module('wowApp')

// Assigning the cachFactory to 'myCache'
    .factory('myCache', function($cacheFactory) {
        return $cacheFactory('myCache');
    })

    .service('keys', function () {
        var self = this;

        self.region = "en_US";
        self.privateKey = "jnfn9kb9a7pwgu327xq4exbedxjnzyxr";

    })

    .service('characterFeed', function (keys, $rootScope, myCache, raceService, classService, bossService, zoneService, realmService, dataService) {
        // Private Variables
        var self = this;

        var raceMap, classMap, bossMap, zoneMap = [], inventoryMap, realmMap;

        var genderMap = ["Male", "Female"];

        var factionMap = ["Alliance", "Horde"];
        var itemQualityMap = ["poor", "common", "uncommon", "rare", "epic", "legendary", "artifact", "heirloom"];
        var itemUpgradableMap = ["Item is not upgradable", "Item is upgradable"];
        var itemBindMap =["Tradeable", "Binds when picked up"];
        var inventorySlots = ['back', 'chest', 'feet', 'finger1', 'finger2', 'hands', 'head', 'legs', 'mainHand', 'neck', 'offHand', 'shirt', 'shoulder', 'tabard', 'trinket1', 'trinket2', 'waist', 'wrist'];
        var itemStatMap = {
            '1' : '+%s Health',
            '2' : '+%s Mana',
            '3' : '+%s Agility',
            '4' : '+%s Strength',
            '5' : '+%s Intellect',
            '6' : '+%s Spirit',
            '7' : '+%s Stamina',
            '12' : 'Equip: Increases defense rating by %s.',
            '13' : 'Equip: Increases your dodge rating by %s.',
            '14' : 'Equip: Increases your parry rating by %s.',
            '15' : 'Equip: Increases your shield block rating by %s.',
            '16' : 'Equip: Improves melee hit rating by %s.',
            '17' : 'Equip: Improves ranged hit rating by %s.',
            '18' : 'Equip: Improves spell hit rating by %s.',
            '19' : 'Equip: Improves melee critical strike rating by %s.',
            '20' : 'Equip: Improves ranged critical strike rating by %s.',
            '21' : 'Equip: Improves spell critical strike rating by %s.',
            '22' : 'Equip: Improves melee hit avoidance rating by %s.',
            '23' : 'Equip: Improves ranged hit avoidance rating by %s.',
            '24' : 'Equip: Improves spell hit avoidance rating by %s.',
            '25' : 'Equip: Improves melee critical avoidance rating by %s.',
            '26' : 'Equip: Improves ranged critical avoidance rating by %s.',
            '27' : 'Equip: Improves spell critical avoidance rating by %s.',
            '28' : 'Equip: Improves melee haste rating by %s.',
            '29' : 'Equip: Improves ranged haste rating by %s.',
            '30' : 'Equip: Improves spell haste rating by %s.',
            '31' : 'Equip: Increases your hit rating by %s.',
            '32' : '+%s Critical Strike',
            '33' : 'Equip: Improves hit avoidance rating by %s.',
            '34' : 'Equip: Improves critical avoidance rating by %s.',
            '35' : 'Equip: Increases your resilience rating by %s.',
            '36' : '+%s Haste',
            '37' : 'Equip: Increases your expertise rating by %s.',
            '38' : 'Equip: Increases attack power by %s.',
            '39' : 'Equip: Increases ranged attack power by %s.',
            '40' : 'Equip: Increases attack power by %s in Cat, Bear, Dire Bear, and Moonkin forms only.',
            '41' : 'Equip: Increases damage done by magical spells and effects by up to %s.',
            '42' : 'Equip: Increases healing done by magical spells and effects by up to %s.',
            '43' : 'Equip: Restores %s mana per 5 sec.',
            '44' : 'Equip: Increases your armor penetration rating by %s.',
            '45' : 'Equip: Increases spell power by %s.',
            '46' : 'Equip: Restores %s health per 5 sec.',
            '47' : 'Equip: Increases spell penetration by %s.',
            '48' : 'Equip: Increases the block value of your shield by %s.',
            '49' : '+%s Mastery',
            '50' : "Equip: Increases your armor rating by %s.",
            '51' : "Equip: Increases your fire resistance by %s.",
            '52' : "Equip: Increases your frost resistance by %s.",
            '54' : "Equip: Increases your shadow resistance by %s.",
            '55' : "Equip: Increases your nature resistance by %s.",
            '56' : "Equip: Increases your arcane resistance by %s.",
            '57' : "Equip: Increases your pvp power by %s.",
            '60' : "Equip: Increase your readiness by %s.",
            '61' : "Equip: Increase your speed by %s.",
            "62" : "Equip: Increase your leech by %s.",
            "63" : "Equip: Increase your avoidence by %s.",
            "64" : "Equip: Increase your indestructible by %s",
            "65" : "Equip: Increase your WOD_5 by %s.",
            '59' : "Equip: Increase your multistrike by %s.",
            "71" : "Equip: Increase your strength, agility or intellect by %s.",
            "72" : "Equip: Increase your strength or agility by %s.",
            '73' : "Equip: Increase your agility or intellect by %s.",
            "74" : "+ %s Strength or Intellect"
        };
        var inventorySlotMap = {
            'head' : 0,
            'neck' : 1,
            'shoulder' : 2,
            'back' : 3,
            'chest': 4,
            'shirt' : 5,
            'tabard' : 6,
            'wrist' : 7,
            'hands' : 8,
            'waist' : 9,
            'legs' : 10,
            'feet' : 11,
            'finger1' : 12,
            'finger2' : 13,
            'trinket1' : 14,
            'trinket2' : 15,
            'mainHand' : 16,
            'offHand' : 17
        };

        var getCacheStatus = function (cache) {
            return myCache.get(cache);
        };

        var setCacheStatus = function (cache, items) {
            myCache.put(cache, items);
        };


        var initRealms = function() {
            if (getCacheStatus("realms")) {
                console.log('realms are defined');
            } else {
                console.log('Realms are not defined');
                realmService.getRealms(function(response){
                    console.log('Get Realms API Call.');
                    setCacheStatus("realms", response.data);
                    // Store in local array
                    realmMap = response.data;
                    // Send broadcast to controller
                    $rootScope.$broadcast('realms_update');
                    console.log('just sent update');
                    if (getCacheStatus("realms")) {
                        console.log('realms are now defined.');
                        console.log('realms are cached: ');
                    }
                }, function(err) {
                    console.log(err.status);

                });
            }

        };
        // Public variables

        return {

            getCacheItems: function(cacheName) {
                return myCache.get(cacheName);
            },

            getInventorySlots: function() {
                return inventorySlots;
            },
            getBoss: function(name) {
                for(var key in bossMap) {
                    if(bossMap[key].name === name) {
                        return bossMap[key];
                    }
                }
                console.log('not found in bosses');
                return "";
            },
            getClass: function(idx) {
                for(var key in classMap) {
                    if(classMap[key].id === idx) {
                        return classMap[key].name;
                    }
                }
            },
            getGender: function(idx) {
                return genderMap[idx];
            },
            getGold: function(sellValue) {
                var n = sellValue;
                var s = "";
                if (sellValue < 0) {
                    s = "-";
                    n = Math.abs(n);
                }
                var gold = Math.floor(((n / 10000)));
                var silver = Math.floor(((n / 100) % 100));
                var copper = Math.floor((n % 100));
                if (!copper) {
                    copper = "";
                } else
                {
                    copper += ' <i class="fa fa-circle currency-copper"  aria-hidden="true"></i>';
                }
                if (!gold) {
                    gold = "";
                } else {
                    gold += ' <i class="fa fa-circle currency-gold"  aria-hidden="true"></i> ';
                }
                if (!silver) {
                    silver = "";
                } else {
                    silver += ' <i class="fa fa-circle currency-silver"  aria-hidden="true"></i> ';
                }
                return s + gold + silver + copper;

            },
            getRace: function(idx) {
                for(var key in raceMap) {
                    if(raceMap[key].id === idx) {
                        return raceMap[key].name;
                    }
                }
            },
            getFaction: function(idx) {
                return factionMap[idx];
            },
            getItemQuality: function(idx) {
                return itemQualityMap[idx];
            },
            getItemUpgradable: function(isUpgradable) {
                if (isUpgradable) {
                    idx = 1;
                } else {
                    idx = 0;
                }
                return itemUpgradableMap[idx];
            },
            getItemBind: function(idx) {
                return itemBindMap[idx];
            },
            getBonusstatsparse: function(statsArray){
                var line = "";
                var combinedStats = "";
                // Sort the order by stat number
                var sortedStats = [];
                sortedStats = statsArray.sort(function(a,b) {
                    return a.stat - b.stat;
                });

                for (var x = 0; x <= sortedStats.length -1; x++) {
                    line = itemStatMap[sortedStats[x].stat];
                    if (sortedStats[x].stat == 74 || sortedStats[x].stat == 36 || sortedStats[x].stat == 49 || sortedStats[x].stat == 7 ) {
                        var statCalc = Math.round(sortedStats[x].amount * 0.046);
                        line = line.replace("%s", statCalc);
                    } else {
                        line = line.replace("%s", sortedStats[x].amount);
                    }

                    if (sortedStats[x].stat > 7) {
                        line = "<span class='item-green-text'>" + line + "</span>";
                    } else {
                        line = "<span class='item-white-text'>" + line + "</span>";
                    }
                    combinedStats += line + '<br>';
                }

                return combinedStats;
            },

            getZone: function(idx) {
                for(var key in zoneMap) {
                    if(zoneMap[key].id === idx) {
                        return zoneMap[key].description;
                    }
                }
                console.log('not found in zones');
                return "";
            },

            getInventorySlot: function(item) {
                // This maps the item name to a slot value as defined by our array.
                return inventorySlotMap[item];
            },

            init: function() {
                initRealms();
                // Build the races map
                if (getCacheStatus("races")) {
                    console.log('races are defined. skipping API call.');
                } else {
                    console.log('races are not defined');
                    raceService.getRaces(function(response){
                        console.log('Race API Call.');
                        setCacheStatus("races", response.data.races);
                        // Store data in local array.
                        raceMap = response.data.races;
                        setCacheStatus("races", response.data.races);
                        if (getCacheStatus("races")) {
                            console.log('races are now defined.');
                            console.log('races are cached: ');
                        }
                    }, function(err) {
                        console.log(err.status);
                    });
                }

                // Build the classes map
                if (getCacheStatus("classes")) {
                    console.log('classes are defined. skipping API call.');
                } else {
                    console.log('classes are not defined');
                    classService.getClasses(function(response){
                        console.log('Classes API Call.');
                        setCacheStatus("classes", response.data.classes);
                        // Store response in local array
                        classMap = response.data.classes;
                        if (getCacheStatus("classes")) {
                            console.log('classes are now defined.');
                            console.log('classes are cached: ');
                        }
                    }, function(err) {
                        console.log(err.status);
                    });
                }

                if (getCacheStatus("bosses")) {
                    console.log('they are defined');
                } else {
                    console.log('Bosses are not defined');
                    bossService.getBosses(function(response){
                        console.log('Boss API Call.');
                        setCacheStatus("bosses", response.data.bosses);
                        // Store in local array
                        bossMap = response.data.bosses;
                        if (getCacheStatus("bosses")) {
                            console.log('Bosses are now defined.');
                            console.log('bosses are cached: ');
                        }
                    }, function(err) {
                        console.log(err.status);
                    });
                }

                if (getCacheStatus("zones")) {
                    console.log('zones are defined');
                } else {
                    console.log('Zones are not defined');
                    zoneService.getZones(function(response){
                        console.log('Get Zones API Call.');
                        setCacheStatus("zones", response.data.zones);
                        // Store in local array
                        zoneMap = response.data.zones;
                        if (getCacheStatus("zones")) {
                            console.log('zones are now defined.');
                            console.log('zones are cached: ');
                        }
                    }, function(err) {
                        console.log(err.status);
                    });
                }
            },


            initRealms: function() {
                initRealms();

            },

        };
    })

    .service('characterService', function($http, $rootScope, myCache, characterFeed, itemService, feedService, inventoryService, dataService, keys) {

        var race;
        var thumbnail;

        var items = [];
        var count = 0;
        var idx = 0;

        self.background = '';
        self.backgroundImage = '';


        self.list = {};
        self.processedFeed = [];
        self.filteredFeed = [];
        self.inventorySlots = [];
        self.inventoryArray = [];


        var getCacheStatus = function (cache) {
            return myCache.get(cache);
        };

        var setCacheStatus = function (key, items) {
            myCache.put(key, items);
        };

        var checkCharacterFeed = function() {
            if (!myCache.get('Char:' + this.name + ':' + this.selectedRealm)) {
                console.log('cache empty for character');
            } else {
                console.log('cache not empty.');
                return myCache.get(this.name + ':' + this.selectedRealm);
            }
        };

        var mapItem = function(idx) {
            for(var key in bossMap) {
                if(bossMap[key].name === idx) {
                    return bossMap[key];
                }
            }

            console.log('not found in bosses');
            return "";
        };


        var processFeed = function(name, realm, feed) {

            // Clear the arrays before we start in case there is leftover information from a previous call.
            self.inventoryArray = [];
            self.inventorySlots = [];

            self.name = name.toLowerCase();
            self.selectedRealm = realm;
            console.log('in Process Feed.');

            // Process through items in reponse and determine the category each falls under.

            for (var x = 0; x <= feed.length - 1; x++) {
                var feedElement = {};
                // If item is loot, modify some of the properties and add it to the end of the items array.  The item array is a temporary array to store loot items while asynch calls
                // are occurring.
                if (feed[x].type === 'LOOT') {
                    // First, we store each object of type loot into a seperate array called items.
                    var itemElement = {};
                    // Record the original position of the item from the AJAX call.
                    itemElement.index = x;
                    itemElement.type = feed[x].type;
                    itemElement.timestamp = feed[x].timestamp;
                    itemElement.id = feed[x].itemId;
                    items.push(itemElement);
                    count++;
                    // Perform a call to the item service, passing on the itemElement that was pushed into the item array.

                    feedElement = callItemService(itemElement);

                    // We add some properties from the original item object into this new object.
                    feedElement.type = itemElement.type;
                    feedElement.timestamp = itemElement.timestamp;
                    // Insert the feedElement into the feed array at the position of the original AJAX call index.
                    var i = items[idx].index - 1;
                    self.processedFeed.splice(items[idx].index, 0, feedElement);
                    idx++;
                } else if (feed[x].type === 'BOSSKILL') {
                    feedElement.timestamp = feed[x].timestamp;
                    feedElement.type = feed[x].type;
                    feedElement.name = feed[x].name;
                    feedElement.icon = feed[x].achievement.icon;
                    feedElement.title = feed[x].achievement.title;
                    feedElement.quantity = feed[x].quantity;
                    feedElement.id = feed[x].criteria.id;
                    if (feed[x].name) {
                        feedElement.tooltip = "BOSS-YES";
                    } else {
                        feedElement.tooltip = "BOSS-NO";
                    }
                   self.processedFeed.push(feedElement);

                } else if (feed[x].type === 'ACHIEVEMENT') {
                    feedElement.timestamp = feed[x].timestamp;
                    feedElement.type = feed[x].type;
                    feedElement.title = feed[x].achievement.title;
                    feedElement.description = feed[x].achievement.description;
                    feedElement.icon = feed[x].achievement.icon;
                    feedElement.tooltip = "ACHIEVEMENT";
                   self.processedFeed.push(feedElement);
                }
            }

            myCache.put('Feed:'+ self.name + ':' + self.selectedRealm, self.processedFeed);

            console.log('Feed is now cached.');
            $rootScope.$broadcast('feed_retrieved');

        };

        // This is the decorator call for the inventory slots.
        var getItemWrapper = function(name, realm) {

            self.name = name;
            self.selectedRealm = realm;

            console.log('in getItemWrapper for Inventory Items.');

            // First clear the array if it has any items from previous calls.
            if (self.inventorySlots){
                console.log('clearing inventory slots of extra items.');
                self.inventorySlots = [];
            }

            // This is the API call for the character Items.  This call populates the inventory slots.

            inventoryService.getItem(function (response) {
                console.log('Get Item API Call for inventory items');
                // Mapping the array by item slot name
                var slots = characterFeed.getInventorySlots();
                for (var x = 0; x < slots.length; x++) {
                    // Map the items here before you push them.
                    var inventorySlot = {};
                    inventorySlot.name = slots[x];

                    if (slots[x] in response.data.items) {
                        inventorySlot.value = response.data.items[slots[x]];
                        inventorySlot.slot = characterFeed.getInventorySlot(slots[x]);
                        inventorySlot.bonusStats = [];
                        inventorySlot.id = response.data.items[slots[x]].id;
                    } else {
                        inventorySlot.value = "none";
                    }


                    self.inventorySlots.push(inventorySlot);
                    var inventoryElement = {};
                    if (slots[x] in response.data.items) {
                        inventoryElement = callItemService(inventorySlot);
                        inventoryElement.slot = slots[x];
                    } else {
                        console.log('key does not exist. Moving on to next item.');
                        inventoryElement.slot = slots[x];
                        inventoryElement.name = slots[x];
                        inventoryElement.quality = 'none';
                    }
                    // Pushing element either way.
                    self.inventoryArray.push(inventoryElement);
                }


                self.inventory = self.inventoryArray.sort(function (a, b) {
                    return characterFeed.getInventorySlot(a.slot) - characterFeed.getInventorySlot(b.slot);
                });

                myCache.put('Inv:'+ self.name.toLowerCase() + ':' + self.selectedRealm, self.inventory);

                console.log('inventory is now cached.');
                $rootScope.$broadcast('inventory_retrieved');

            }, function (err) {
                console.log(err.status);

            });
        };



        var callItemService = function (itemElement) {
            var item = {};

            itemService.getItem(itemElement.id, function (response) {
                item.name = response.data.name;
                item.icon = response.data.icon;
                item.armor = response.data.armor;
                item.bonusStats = response.data.bonusStats;
                item.buyPrice = response.data.buyPrice;
                item.requiredLevel = response.data.requiredLevel;
                if (response.data.socketInfo) {
                    item.socketInfo = response.data.socketInfo;
                }
                item.upgradable = response.data.upgradable;
                item.itemLevel = response.data.itemLevel;
                item.itemBind = response.data.itemBind;
                item.itemClass = response.data.itemClass;
                item.maxDurability = response.data.maxDurability;
                item.sellPrice = response.data.sellPrice;
                item.quality = response.data.quality;
            }, function (err) {
                console.log(err.status);
            });
            return item;
        };

        var checkFeedCache = function(item) {

            if (!myCache.get(item.timestamp + ':' + item.id)) {
                console.log('cache empty for item.');
                var result = callItemService(item);
                console.log('placing item in cache.');
                myCache.put(item.timestamp + ':' + item.id, result);
                console.log(result);
                return result;

            } else {
                console.log('cache has item. Retrieving item from cache.');
                return myCache.get(item.timestamp + ':' + item.id);
            }

        };

        var checkItemCache = function(item) {

            if (!myCache.get(item.type + ':' + item.id)) {
                console.log('cache empty for item.');
                // return getItem(item.type + ':' + item.id);
                var result = callItemService(item);
                console.log('placing item in cache.');
                myCache.put(item.type + ':' + item.id, result);
                return result;

            } else
            {
                console.log('cache not empty.');
                return myCache.get(item.type + ':' + item.id);
            }

        };

        var getCacheItems = function(cacheName) {
            return myCache.get(cacheName);
        };

        var setBackground = function() {
            console.log('setting background.');

            // Set the background images
            // this first one has problems loading sometimes.

            $(".profile-wrapper").css("background", "url(" + self.backgroundImg + ") no-repeat 182px 115px");

            // Set background image for profile based on race
            $(".content-top").css("background", "url" + self.background + ") left top no-repeat" );


        };

         var characterImage = function(path) {
            var imagePath = path.substr(0, path.indexOf('avatar.jpg'));
            imagePath += "profilemain.jpg";
            return imagePath;
        };

        // Character Profile API Call - Charcater Profile
        self.getCharacter = function(callback, err) {
            $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name + '?jsonp=JSON_CALLBACK',  { cache: true,  params: {  locale: keys.region, apikey: keys.privateKey } } )
                .then(callback,err);
        };

        // Character Profile API Call - Items
        self.getItem = function(callback, err) {
            $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name +  '?jsonp=JSON_CALLBACK',  {cache: true, params: {  locale: keys.region, apikey: keys.privateKey, fields: "items" } } )
                .then(callback,err);
        };


        // Achievement API Call - Achievement
        self.getAchievementDetails = function(achievementID, callback, err) {
            $http.jsonp('https://us.api.battle.net/wow/achievement/' + achievementID + '?jsonp=JSON_CALLBACK',  { cache: true, params: { locale: keys.region, apikey: keys.privateKey } } )
                .then(callback,err);
        };

        return {

            getCacheItems: function (cacheName) {
                return myCache.get(cacheName);
            },


            init: function() {
                // This starts both the Feed Call and the Inventory Call.
                var self = this;

                if (getCacheStatus('Char:' + self.name.toLowerCase() + ':' + self.selectedRealm)) {
                    console.log('character is cached. skipping API call.');
                    console.log('Checking cache for feed.');
                    $rootScope.$broadcast('character_retrieved');

                    if (getCacheStatus('Feed:' +self.name.toLowerCase() + ':' + self.selectedRealm)) {
                        console.log('feed is cached.');
                        $rootScope.$broadcast('feed_retrieved');

                        if (getCacheStatus('Inv:' + self.name.toLowerCase() + ':' + self.selectedRealm)) {
                         console.log('inventory is cached.');
                         $rootScope.$broadcast('inventory_retrieved');
                        }
                    }
                } else {
                    console.log('character is not defined');
                    // Pass the parameters on to the service prior to the call.
                    inventoryService.name = this.name;
                    inventoryService.selectedRealm = this.selectedRealm;
                    getItemWrapper(this.name, this.selectedRealm);

                    // Setting up the feedService call.
                    feedService.name = this.name;
                    feedService.selectedRealm = this.selectedRealm;
                    feedService.getCharacterFeed(function(response){
                        console.log('Character Feed API Call.');
                        if (!race) {
                            race = response.data.race;
                        }
                        thumbnail = response.data.thumbnail;

                        var character = {
                            'name' : response.data.name,
                            'level' : response.data.level,
                            'gender' : response.data.gender,
                            'race' : race,
                            'battlegroup' : response.data.battlegroup,
                            'class': response.data.class,
                            'faction' : response.data.faction,
                            'realm' : response.data.realm,
                            'thumbnail' : response.data.thumbnail,
                            'thk' : response.data.totalHonorableKills,
                            // 'backgroundImg' : "http://render-api-us.worldofwarcraft.com/static-render/us/" + characterImage(thumbnail),
                            'backgroundImg' : "http://render-us.worldofwarcraft.com/character/" + characterImage(thumbnail),
                            'background' : "http://us.battle.net/wow/static/images/character/summary/backgrounds/race/" + race + ".jpg"
                        };

                        // Set the background based on the recent API call.
                        setBackground(character.backgroundImg, character.background);

                        setCacheStatus('Char:' + character.name.toLowerCase() + ':' + character.realm, character);

                        $rootScope.$broadcast('character_retrieved');
                        console.log('just sent character retrieve update');
                        processFeed(self.name, self.selectedRealm, response.data.feed);

                    }, function(err) {
                        console.log(err.status);

                    });
                }
                console.log('end of init function.');
            },

            setBackground: function(first_url, second_url) {

                // Set the background images
                $(".profile-wrapper").css("background", "url(" + second_url + ") no-repeat 182px 115px");

                // Set background image for profile based on race
                $(".content-top").css("background", "url(" + first_url + ") left top no-repeat" );
            }
        };
    })

    .service('dataService', function($http, keys) {

        // DATA Resources - Charcater Achievements
        this.getAchievements = function(callback, err) {
            $http.jsonp('https://us.api.battle.net/wow/data/character/achievements?jsonp=JSON_CALLBACK',  {cache: true, params: {  locale: keys.region, apikey: keys.privateKey } } )
                .then(callback,err);
        };

    })


    .service('realmService', function($http, keys, myCache) {

        this.getRealms = function(callback, err) {
            $http.jsonp('https://us.api.battle.net/wow/realm/status?jsonp=JSON_CALLBACK',  { cache: myCache, params: {  locale: keys.region, apikey: keys.privateKey } } )
                .then(callback,err);
        };

    })

    .service('raceService', function($http, keys) {


        this.getRaces = function(callback, err) {
            $http.jsonp('https://us.api.battle.net/wow/data/character/races?jsonp=JSON_CALLBACK',  { cache: true, params: { locale: keys.region, apikey: keys.privateKey } } )
                .then(callback,err);
        };

    })

    .service('classService', function($http, keys) {


        this.getClasses = function(callback, err) {
            $http.jsonp('https://us.api.battle.net/wow/data/character/classes?jsonp=JSON_CALLBACK',  { cache: true, params: {  locale: keys.region, apikey: keys.privateKey} } )
                .then(callback,err);
        };

    })

    .service('bossService', function($http, keys) {

        this.getBosses = function(callback, err) {
            $http.jsonp('https://us.api.battle.net/wow/boss/?jsonp=JSON_CALLBACK',  { cache: true, params: {  locale: keys.region, apikey: keys.privateKey} } )
                .then(callback,err);
        };

    })

    .service('zoneService', function($http, keys) {

        this.getZones = function(callback, err) {
            $http.jsonp('https://us.api.battle.net/wow/zone/?jsonp=JSON_CALLBACK',  { cache: true, params: {  locale: keys.region, apikey: keys.privateKey} } )
                .then(callback,err);
        };

    })

    .service('itemService', function($http, characterFeed, keys) {

        // Item API Call - Item API
        this.getItem = function(itemId, callback, err) {
            $http.jsonp('https://us.api.battle.net/wow/item/' + itemId + '?jsonp=JSON_CALLBACK',  {cache: true, params: {  apikey: keys.privateKey} } )
                .then(callback,err);
        };


    })

    .service('feedService', function($http, keys) {


        // Character Profile API Call - Charcater Feed
        this.getCharacterFeed = function(callback, err) {
            $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name + '?jsonp=JSON_CALLBACK',  {cache: true, params: {  locale: keys.region, apikey: keys.privateKey, fields: "feed"} } )
                .then(callback,err);
        };

    })

    .service('inventoryService', function($http, keys) {


        // Character Profile API Call - Items
        this.getItem = function(callback, err) {
            $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name +  '?jsonp=JSON_CALLBACK',  {cache: true, params: {  locale: keys.region, apikey: keys.privateKey, fields: "items" } } )
                .then(callback,err);
        };

    });
