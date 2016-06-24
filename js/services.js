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
