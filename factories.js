/** Factories return an object where you can run some code beforehand
 * var example = new ExampleFactory();
 * example.modifyFonts(somehow);
 */
angular.module('wowApp')
// .factory('Character', function($scope, sharedProperties, characterService) {
//
//     return function(userId) {
//         // Private variables
//         // var someValue = '';
//
//
//         // Public Variables
//         var self = {
//             id: 0,
//             info: {
//                 first: '',
//                 last: '',
//                 email: '',
//             }
//         };
//
//         // Private Functions
//         function init() {
//             self.id = userId;
//             self.load();
//         }
//
//         // Public Functions
//         self.load = function() {
//             // call character service api
//         }
//
//         init();
//
//         // Return instance
//         return self;
//     }
// });

.factory('keys', function() {

    return function() {

        var self = "jnfn9kb9a7pwgu327xq4exbedxjnzyxr";
        // Return instance
        return self;
    }
})

.factory('region', function() {

    return function() {

        var self = "en_US";
        // Return instance
        return self;
    }
})

.factory('genderMap', function() {

    return function() {

        var self = ["Male", "Female"];
        // Return instance
        return self;
    }
})

.factory('races', function($http) {

    return function() {


        self.load = function(callback, err) {
            $http.jsonp('https://us.api.battle.net/wow/data/character/races?jsonp=JSON_CALLBACK',  { cache: true, params: {  locale: this.region, apikey: this.keyValue} } )
                .then(callback,err)
        };

        // setRaces: function(items) {
        //     raceMap = items;
        //     racesDefined = true;
        // },

        // Return instance
        return self;
    };


});