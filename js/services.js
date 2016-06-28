//SERVICES

angular.module('wowApp')

.service('sharedProperties', function () {
    var region = "en_US";
    var privateKey = "jnfn9kb9a7pwgu327xq4exbedxjnzyxr";
    
    var classMap = ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Death Knight", "Shaman", "Mage", "Warlock", "Monk", "Druid"];
    var genderMap = ["Male", "Female"];
    var raceMap = {     1 : "Human",
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
    var factionMap = ["Alliance", "Horde"];
    var itemQualityMap = ["poor", "common", "uncommon", "rare", "epic", "legendary", "artifact", "heirloom"];
    var itemUpgradableMap = ["Item is not upgradable", "Item is upgradable"];
    var itemBindMap =["Tradeable", "Binds when picked up"];
    var itemStatMap = {
        '1' : '+%s Health',
        '2' : '+%s Mana',
        '3' : '+%s Agility',
        '4' : '+%s Strength',
        '5' : '+%s Intellect',
        '6' : '+%s Spirit',
        '7' : '+%s Stamina',
        '46' : 'Equip: Restores %s health per 5 sec.',
        '44' : 'Equip: Increases your armor penetration rating by %s.',
        '38' : 'Equip: Increases attack power by %s.',
        '15' : 'Equip: Increases your shield block rating by %s.',
        '48' : 'Equip: Increases the block value of your shield by %s.',
        '19' : 'Equip: Improves melee critical strike rating by %s.',
        '20' : 'Equip: Improves ranged critical strike rating by %s.',
        '32' : 'Equip: Increases your critical strike rating by %s.',
        '21' : 'Equip: Improves spell critical strike rating by %s.',
        '25' : 'Equip: Improves melee critical avoidance rating by %s.',
        '26' : 'Equip: Improves ranged critical avoidance rating by %s.',
        '34' : 'Equip: Improves critical avoidance rating by %s.',
        '27' : 'Equip: Improves spell critical avoidance rating by %s.',
        '12' : 'Equip: Increases defense rating by %s.',
        '13' : 'Equip: Increases your dodge rating by %s.',
        '37' : 'Equip: Increases your expertise rating by %s.',
        '40' : 'Equip: Increases attack power by %s in Cat, Bear, Dire Bear, and Moonkin forms only.',
        '28' : 'Equip: Improves melee haste rating by %s.',
        '29' : 'Equip: Improves ranged haste rating by %s.',
        '36' : 'Equip: Increases your haste rating by %s.',
        '30' : 'Equip: Improves spell haste rating by %s.',
        '16' : 'Equip: Improves melee hit rating by %s.',
        '17' : 'Equip: Improves ranged hit rating by %s.',
        '31' : 'Equip: Increases your hit rating by %s.',
        '18' : 'Equip: Improves spell hit rating by %s.',
        '22' : 'Equip: Improves melee hit avoidance rating by %s.',
        '23' : 'Equip: Improves ranged hit avoidance rating by %s.',
        '33' : 'Equip: Improves hit avoidance rating by %s.',
        '24' : 'Equip: Improves spell hit avoidance rating by %s.',
        '43' : 'Equip: Restores %s mana per 5 sec.',
        '49' : 'Equip: Increases your mastery rating by %s.',
        '14' : 'Equip: Increases your parry rating by %s.',
        '39' : 'Equip: Increases ranged attack power by %s.',
        '35' : 'Equip: Increases your resilience rating by %s.',
        '41' : 'Equip: Increases damage done by magical spells and effects by up to %s.',
        '42' : 'Equip: Increases healing done by magical spells and effects by up to %s.',
        '47' : 'Equip: Increases spell penetration by %s.',
        '45' : 'Equip: Increases spell power by %s.'};

        return {
            getRegion: function () {
                return region;
            },
            getPrivateKey: function() {
                return privateKey;
            },
            getClass: function(idx) {
                return classMap[idx];
            },
            getGender: function(idx) {
                return genderMap[idx];
            },
            getRace: function(idx) {
                return raceMap[idx];
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
                var shit = "";
                for (var x = 0; x <= item.length -1; x++) {
                    line = itemStatMap[item[x].stat];
                    line = line.replace("%s", item[x].amount);

                    if (item[x].stat > 7) {
                        line = "<span class='item-text-green'>" + line + "</span>";
                    }

                    shit += line + '<br>';
                }
                console.log(shit);
                return shit;

            }

            
        };
    })

.service('characterService', function($http, sharedProperties) {
    
    this.selectedRealm = "";
    this.name = "";
    this.characterResult = "";
    
       
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
