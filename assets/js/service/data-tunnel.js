(function() {

    'use strict';

    angular.module('barikoi')
        .factory('DataTunnel', ['$http', '$localStorage', 'urls', function($http, $localStorage, urls) {
             var data = {};

            var set_data = function(ride) {
              data = ride;
            };

            var get_data = function(){
              return data;
            };

            return {
                set_data: set_data,
                get_data: get_data
            };


        }]);

}());