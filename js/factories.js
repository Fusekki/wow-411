wowApp.factory('charService', function($http, $q) {

  //  Create a class that represents our name service.
  function charService() {

    var self = this;
     //  Initially the name is unknown....
    self.characterValue = null;
    //  getName returns a promise which when 
    //  fulfilled returns the name.
    self.getCharacter = function(region, keyValue, name, selectedRealm) {
        var deferred = $q.defer();
  //    If we already have the name, we can resolve the promise.
        if (self.characterValue !== null) {
            deferred.resolve(self.characterValue + " (from Cache!)");
        } else {
            //    Get the name from the server.
            $http.jsonp('https://us.api.battle.net/wow/character/' + $scope.selectedRealm + '/' + $scope.name + "?jsonp=JSON_CALLBACK",
                { params: {  locale: $scope.region, apikey: $scope.keyValue} } )
                .then(function(response) {
                    self.characterValue = response;
                    deferred.resolve(response + " (from Server!)");
                }), (function(result) {
                    deferred.reject(response);
                });
            }
        

    //    Now return the promise.
    return deferred.promise;
    };
  }
return new charService();    
    

});


// register the interceptor as a service
wowApp.factory('myInterceptor', function($q, dependency1, dependency2) {
    console.log('in interceptor');
  return {
    // optional method
    'request': function(config) {
      // do something on success
      return config;
    },

    // optional method
   'requestError': function(rejection) {
      // do something on error
      if (canRecover(rejection)) {
        return responseOrNewPromise
      }
      return $q.reject(rejection);
    },



    // optional method
    'response': function(response) {
      // do something on success
      return response;
    },

    // optional method
   'responseError': function(rejection) {
      // do something on error
      if (canRecover(rejection)) {
        return responseOrNewPromise
      }
      return $q.reject(rejection);
    }
  };
});

