//SERVICES

angular.module('wowApp')

.service('sharedProperties', function () {
    var self = this;

    var racesDefined, classesDefined, bossesDefined, zonesDefined = false;
    var raceMap, classMap, bossMap, zoneMap = [];


    var region = "en_US";
    var privateKey = "jnfn9kb9a7pwgu327xq4exbedxjnzyxr";

    var genderMap = ["Male", "Female"];

    var factionMap = ["Alliance", "Horde"];
    var itemQualityMap = ["poor", "common", "uncommon", "rare", "epic", "legendary", "artifact", "heirloom"];
    var itemUpgradableMap = ["Item is not upgradable", "Item is upgradable"];
    var itemBindMap =["Tradeable", "Binds when picked up"];
    var inventorySlots = ['back', 'chest', 'feet', 'finger1', 'finger2', 'hands', 'head', 'legs', 'mainHand', 'neck', 'shirt', 'shoulder', 'waist', 'wrist'];
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
        '32' : 'Equip: Increases your critical strike rating by %s.',
        '33' : 'Equip: Improves hit avoidance rating by %s.',
        '34' : 'Equip: Improves critical avoidance rating by %s.',
        '35' : 'Equip: Increases your resilience rating by %s.',
        '36' : 'Equip: Increases your haste rating by %s.',
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
        '49' : 'Equip: Increases your mastery rating by %s.',
        '50' : "Equip: Increases your armor rating by %s.",
        '51' : "Equip: Increases your fire resistance by %s.",
        '52' : "Equip: Increases your frost resistance by %s.",
        '54' : "Equip: Increases your shadow resistance by %s.",
        '55' : "Equip: Increases your nature resistance by %s.",
        '56' : "Equip: Increases your arcane resistance by %s.",
        '57' : "Equip: Increases your pvp power by %s."
    }
        return {

            getBossStatus: function() {
                return bossesDefined;
            },
            getClassStatus: function() {
                return classesDefined;
            },
            getInventorySlots: function() {
                return inventorySlots;
            },
            getRaceStatus: function() {
              return racesDefined;
            },
            getRegion: function () {
                return region;
            },
            getPrivateKey: function() {
                return privateKey;
            },
            getZoneStatus: function() {
                return zonesDefined;
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
            getBonusstatsparse: function(item){
                var line = "";
                var combinedStats = "";
                for (var x = 0; x <= item.length -1; x++) {
                    line = itemStatMap[item[x].stat];
                    line = line.replace("%s", item[x].amount);
                    if (item[x].stat > 7) {
                        line = "<span class='item-text-green'>" + line + "</span>";
                    }
                    combinedStats += line + '<br>';
                }
                // console.log(combinedStats);
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

            setRaces: function(items) {
                raceMap = items;
                racesDefined = true;
            },
            setClasses: function(items) {
                classMap = items;
                classesDefined = true;
            },
            setBosses: function(items) {
                bossMap = items;
                // console.log(bossMap);
                bossesDefined = true;
            },
            setZones: function(items) {
                zoneMap = items;
                // console.log(zoneMap);
                zonesDefined = true;
            }

            
        };
    })

.service('characterService', function($http, sharedProperties) {
    
    // this.selectedRealm = "";
    // this.name = "";
    // this.characterResult = "";
    
       
    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();
    
    
    this.getCharacter = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name + '?jsonp=JSON_CALLBACK',  { params: {  locale: this.region, apikey: this.keyValue} } )
//        .then(callback)
         .then(callback,err) 
    };

    this.getCharacterFeed = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name + '?jsonp=JSON_CALLBACK',  { params: {  locale: this.region, apikey: this.keyValue, fields: "feed"} } )
        //        .then(callback)
            .then(callback,err)
    };

    this.getItem = function(itemId, callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/item/' + itemId + '?jsonp=JSON_CALLBACK',  { params: {  apikey: this.keyValue} } )
        //        .then(callback)
            .then(callback,err)
    };


    this.getAchievements = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name + '?jsonp=JSON_CALLBACK',  { params: {  locale: this.region, apikey: this.keyValue, fields: "achievements" } } )
//        .then(callback)
         .then(callback,err)
    };

    this.getAchievementDetails = function(achievementID, callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/achievement/' + achievementID + '?jsonp=JSON_CALLBACK',  { params: {  locale: this.region, apikey: this.keyValue } } )
        //        .then(callback)
            .then(callback,err)
    };
  
                
})

.service('realmService', function($http, sharedProperties) {
    
    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();

    this.getRealms = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/realm/status?jsonp=JSON_CALLBACK',  { params: {  locale: this.region, apikey: this.keyValue} } )
//        .then(callback)
         .then(callback,err) 
    };  
                
})

.service('raceService', function($http, sharedProperties) {

    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();

    this.getRaces = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/data/character/races?jsonp=JSON_CALLBACK',  { params: {  locale: this.region, apikey: this.keyValue} } )
        //        .then(callback)
            .then(callback,err)
    };

})

.service('classService', function($http, sharedProperties) {

    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();

    this.getClasses = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/data/character/classes?jsonp=JSON_CALLBACK',  { params: {  locale: this.region, apikey: this.keyValue} } )
        //        .then(callback)
            .then(callback,err)
    };

})

.service('bossService', function($http, sharedProperties) {

    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();

    this.getBosses = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/boss/?jsonp=JSON_CALLBACK',  { params: {  locale: this.region, apikey: this.keyValue} } )
        //        .then(callback)
            .then(callback,err)
    };

})

.service('zoneService', function($http, sharedProperties) {

    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();

    this.getZones = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/zone/?jsonp=JSON_CALLBACK',  { params: {  locale: this.region, apikey: this.keyValue} } )
        //        .then(callback)
            .then(callback,err)
    };

})

.service('characterItemService', function($http, sharedProperties) {

    this.keyValue = sharedProperties.getPrivateKey();
    this.region = sharedProperties.getRegion();

    this.getItems = function(callback, err) {
        $http.jsonp('https://us.api.battle.net/wow/character/' + this.selectedRealm + '/' + this.name +  '?jsonp=JSON_CALLBACK',  { params: {  locale: this.region, apikey: this.keyValue, fields: "items" } } )

        //        .then(callback)
            .then(callback,err)
    };

});




//.service('realmService', function($resource) {
//
//    this.GetRealms = function(region, key) {
//        var realmsAPI = $resource("https://us.api.battle.net/wow/realm/status?jsonp=JSON_CALLBACK", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
//             
//        return realmsAPI.get ( { locale: region, apikey: key } );
//    };
//                
//});
