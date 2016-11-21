//SERVICES

angular.module('wowApp')

.service('sharedProperties', function (raceService, classService, bossService, zoneService, realmService) {
    var self = this;

    var racesDefined, classesDefined, bossesDefined, zonesDefined, realmsDefined = false;
    var raceMap, classMap, bossMap, zoneMap = [], inventoryMap, realmMap;


    self.region = "en_US";
    self.privateKey = "jnfn9kb9a7pwgu327xq4exbedxjnzyxr";

    var genderMap = ["Male", "Female"];

    var factionMap = ["Alliance", "Horde"];
    var itemQualityMap = ["poor", "common", "uncommon", "rare", "epic", "legendary", "artifact", "heirloom"];
    var itemUpgradableMap = ["Item is not upgradable", "Item is upgradable"];
    var itemBindMap =["Tradeable", "Binds when picked up"];
    var inventorySlots = ['back', 'chest', 'feet', 'finger1', 'finger2', 'hands', 'head', 'legs', 'mainHand', 'neck', 'offHand', 'shirt', 'shoulder', 'trinket1', 'trinket2', 'waist', 'wrist'];
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

    var getBossStatus = function() {
        return bossesDefined;
    };
    var getClassStatus = function() {
        return classesDefined;
    };

    var getRaceStatus = function() {
        return racesDefined;
    };

    var getZoneStatus = function() {
        return zonesDefined;
    };

    var getRealmStatus = function() {
        return realmsDefined;
    };

    var getRealms = function() {
        return realmMap;
    };

    var setClasses = function(items) {
        classMap = items;
        classesDefined = true;
    };

    var setRaces = function(items) {
        raceMap = items;
        racesDefined = true;
        console.log(raceMap);
    };

    var setBosses = function(items) {
        bossMap = items;
        // console.log(bossMap);
        bossesDefined = true;
    };
    var setZones = function(items) {
        zoneMap = items;
        // console.log(zoneMap);
        zonesDefined = true;
    };

    var setRealms = function(items) {
        realmMap = items;
        console.log(realmMap);
        realmsDefined = true;
    };

        return {

            getInventorySlots: function() {
                return inventorySlots;
            },
            getRegion: function () {
                return self.region;
            },
            getPrivateKey: function() {
                return self.privateKey;
            },
            getRealms: function() {
                return realmMap;
            },
            getBoss: function(idx) {
                // console.log(idx);
                for(var key in bossMap) {
                     // console.log(bossMap[key]);
                    if(bossMap[key].name === idx) {
                        // console.log(bossMap[key]);
                        return bossMap[key];
                    }
                }

                console.log('not found in bosses');
                return "";
            },
            getClass: function(idx) {
                for(var key in classMap) {
                    // console.log(raceMap.races[key].id);
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
                    // console.log(raceMap.races[key].id);
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
                    var idx = 1;
                } else {
                    var idx = 0;
                }
                return itemUpgradableMap[idx];
            },
            getItemBind: function(idx) {
                return itemBindMap[idx];
            },
            getBonusstatsparse: function(statsArray){
                // console.log(statsArray);
                var line = "";
                var combinedStats = "";
                // Sort the order by stat number
                var sortedStats = [];
                sortedStats = statsArray.sort(function(a,b) {
                    // console.log(a);
                    // console.log(a.stat);
                    // console.log(b.stat);
                    //
                    // console.log(statsArray[a]);
                    return a.stat - b.stat;
                });

                // console.log(sortedStats);

                for (var x = 0; x <= sortedStats.length -1; x++) {
                    // console.log(x);
                    // console.log(statsArray);
                    // var temp = statsArray[x].stat;
                    // console.log(temp);
                    line = itemStatMap[sortedStats[x].stat];
                    // console.log(line);
                    // console.log(statsArray[x].stat);
                    // console.log(statsArray[x].amount);
                    if (sortedStats[x].stat == 74 || sortedStats[x].stat == 36 || sortedStats[x].stat == 49 || sortedStats[x].stat == 7 ) {
                        var statCalc = Math.round(sortedStats[x].amount * .046);
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
                // console.log(idx);
                for(var key in zoneMap) {
                    // console.log(bossMap[key]);
                    if(zoneMap[key].id === idx) {
                        // console.log(zoneMap[key].description);
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

                if (getRealmStatus()) {
                    console.log('realms are defined');
                } else {
                    console.log('Realms are not defined');
                    realmService.getRealms(function(response){
                        console.log('Get Realms API Call.');
                        // console.log(response.data);
                        setRealms(response.data);
                        if (getRealmStatus()) {
                            console.log('realms are now defined.');
                        }
                        // $scope.realmsResult = response.data;
                    }, function(err) {
                        console.log(err.status);

                    });
                }

                // Build the races map
                if (getRaceStatus()) {
                    console.log('races are defined. skipping API call.');
                } else {
                    console.log('races are not defined');
                   raceService.getRaces(function(response){
                        console.log('Race API Call.');
                        // console.log(response.data)
                        setRaces(response.data.races);
                        if (getRaceStatus()) {
                            console.log('races are now defined.');
                            console.log(raceMap);
                        }
                    }, function(err) {
                        console.log(err.status);
                    });
                }

                // Build the classes map
                if (getClassStatus()) {
                    console.log('classes are defined. skipping API call.');
                } else {
                    // console.log('they are not defined');
                    console.log('classes are not defined');
                    classService.getClasses(function(response){
                        console.log('Classes API Call.');
                        // console.log(response.data);
                        setClasses(response.data.classes);
                        if (getClassStatus()) {
                            console.log('classes are now defined.');
                        }
                        // console.log(sharedProperties.getClassStatus());
                    }, function(err) {
                        console.log(err.status);
                    });
                }

                if (getBossStatus()) {
                    console.log('they are defined');
                } else {
                    // console.log('they are not defined');
                    console.log('Bosses are not defined');
                    bossService.getBosses(function(response){
                        console.log('Boss API Call.');
                        // console.log(response.data);
                        setBosses(response.data.bosses);
                        if (getBossStatus()) {
                            console.log('Bosses are now defined.');
                        }
                        // console.log(sharedProperties.getBossStatus());
                    }, function(err) {
                        console.log(err.status);
                    });
                }

                if (getZoneStatus()) {
                    console.log('zones are defined');
                } else {
                    // console.log('zones are not defined');
                    console.log('Zones are not defined');
                    zoneService.getZones(function(response){
                        console.log('Get Zones API Call.');
                        // console.log(response.data);
                        setZones(response.data.zones);
                        if (getZoneStatus()) {
                            console.log('zones are now defined.');
                        }
                        // console.log(sharedProperties.getZoneStatus());
                    }, function(err) {
                        console.log(err.status);
                    });
                }



            }
        };
    })

.service('characterService', function($http, sharedProperties) {
    

       
    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();
    
    // Character Profile API Call - Charcater Profile
    this.getCharacter = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name + '?jsonp=JSON_CALLBACK',  { cache: true,  params: {  locale: this.region, apikey: this.keyValue} } )
         .then(callback,err)
    };

    // Character Profile API Call - Charcater Feed
    this.getCharacterFeed = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name + '?jsonp=JSON_CALLBACK',  {cache: true, params: {  locale: this.region, apikey: this.keyValue, fields: "feed"} } )
            .then(callback,err)
    };

    // Character Profile API Call - Items
    this.getItem = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name +  '?jsonp=JSON_CALLBACK',  {cache: true, params: {  locale: this.region, apikey: this.keyValue, fields: "items" } } )
            .then(callback,err)
    };


    // // DATA Resources - Charcater Achievements
    // this.getAchievements = function(callback, err) {
    //     $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name + '?jsonp=JSON_CALLBACK',  { params: {  locale: this.region, apikey: this.keyValue, fields: "achievements" } } )
    //      .then(callback,err)
    // };

    // Achievement API Call - Achievement
    this.getAchievementDetails = function(achievementID, callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/achievement/' + achievementID + '?jsonp=JSON_CALLBACK',  { cache: true, params: {  locale: this.region, apikey: this.keyValue } } )
            .then(callback,err)
    };
  
                
})

.service('dataService', function($http, sharedProperties) {



    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();


    // DATA Resources - Charcater Achievements
    this.getAchievements = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name + '?jsonp=JSON_CALLBACK',  {cache: true, params: {  locale: this.region, apikey: this.keyValue, fields: "achievements" } } )
            .then(callback,err)
    };

})


.service('realmService', function($http) {
    console.log('here');

    
    // this.keyValue = sharedProperties.getPrivateKey();
    // this.region = sharedProperties.getRegion();

    this.getRealms = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/realm/status?jsonp=JSON_CALLBACK',  { cache: true, params: {  locale: self.region, apikey: self.privateKey} } )
         .then(callback,err)
    };  
                
})

.service('raceService', function($http) {

    // this.keyValue = sharedProperties.getPrivateKey();
    // this.region = sharedProperties.getRegion();

    console.log($scope.privateKey);
    console.log(region);
    this.getRaces = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/data/character/races?jsonp=JSON_CALLBACK',  { cache: true, params: {  locale: self.region, apikey: self.privateKey} } )
            .then(callback,err)
    };

})

.service('classService', function($http) {
    console.log(self.privateKey);
    console.log(self.region);
    // this.keyValue = sharedProperties.getPrivateKey();
    // this.region = sharedProperties.getRegion();

    this.getClasses = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/data/character/classes?jsonp=JSON_CALLBACK',  { cache: true, params: {  locale: self.region, apikey: self.privateKey} } )
            .then(callback,err)
    };

})

.service('bossService', function($http) {

    // this.keyValue = sharedProperties.getPrivateKey();
    // this.region = sharedProperties.getRegion();

    this.getBosses = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/boss/?jsonp=JSON_CALLBACK',  { cache: true, params: {  locale: self.region, apikey: self.privateKey} } )
            .then(callback,err)
    };

})

.service('zoneService', function($http) {

    // this.keyValue = sharedProperties.getPrivateKey();
    // this.region = sharedProperties.getRegion();

    this.getZones = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/zone/?jsonp=JSON_CALLBACK',  { cache: true, params: {  locale: self.region, apikey: self.privateKey} } )
            .then(callback,err)
    };

})

.service('itemService', function($http, sharedProperties) {

    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();

    // Item API Call - Item API
    this.getItem = function(itemId, callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/item/' + itemId + '?jsonp=JSON_CALLBACK',  {cache: true, params: {  apikey: this.keyValue} } )
            .then(callback,err)
    };

})
