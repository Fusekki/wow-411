//SERVICES

wowApp.service('characterService', ['$resource', function($resource) {
    
    this.name = null;
    this.selectedRealm = null;

    this.GetCharacter = function(region, key, name, server) {
        var realmsAPI = $resource("https://us.api.battle.net/wow/character/:realm/:characterName", { realm: server, characterName: name }, { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
     
        
    return realmsAPI.get ( { locale: region, apikey: key } );
    };
                
}]);

wowApp.service('realmService', ['$resource', function($resource) {

    this.GetRealms = function(region, key) {
        var realmsAPI = $resource("https://us.api.battle.net/wow/realm/status?jsonp=JSON_CALLBACK", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
     
        
    return realmsAPI.get ( { locale: region, apikey: key } );
    };
                
}]);


// https://us.api.battle.net/wow/character/emerald%20dream/Rhedyn?locale=en_US&jsonp=JSON_CALLBACK&apikey=jnfn9kb9a7pwgu327xq4exbedxjnzyxr

// https://us.api.battle.net/wow/character/?apikey=jnfn9kb9a7pwgu327xq4exbedxjnzyxr&callback=angular.callbacks._2&locale=en_US
// https://us.api.battle.net/wow/character/?apikey=jnfn9kb9a7pwgu327xq4exbedxjnzyxr&callback=angular.callbacks._2&characterName=rhedyn&locale=en_US&realm=Emerald+Dream
// https://us.api.battle.net/wow/character?apikey=jnfn9kb9a7pwgu327xq4exbedxjnzyxr&callback=angular.callbacks._2&characterName=rhedyn&locale=en_US&realm=Emerald+Dream
// realms:
// type:

// population:
// queue: 
// name: