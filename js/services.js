//SERVICES

wowApp.service('characterService', function() {
    
    this.name = null;
    this.selectedRealm = null;
                
});

wowApp.service('realmService', ['$resource', function($resource) {

    this.GetRealms = function(region, key) {
        var realmsAPI = $resource("https://us.api.battle.net/wow/realm/status?jsonp=JSON_CALLBACK", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
     
        
    return realmsAPI.get ( { locale: region, apikey: key } );
    };
                
}]);

// realms:
// type:

// population:
// queue: 
// name: