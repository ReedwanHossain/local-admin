(function() {


    'use strict';

    angular.module('barikoi')
        .factory('Auth', ['$http', '$q', '$localStorage', 'urls', function($http, $q, $localStorage, urls) {
            //Auth Service...............................................

            function changeUser(user) {
                angular.extend(currentUser, user);
            }

            //

            function urlBase64Decode(str) {
                var output = str.replace('-', '+').replace('_', '/');
                switch (output.length % 4) {
                    case 0:
                        break;
                    case 2:
                        output += '==';
                        break;
                    case 3:
                        output += '=';
                        break;
                    default:
                        throw 'Illegal base64url string!';
                }
                return window.atob(output);
            }

            function getUserFromToken() {
                var token = $localStorage.token;
                var user = {};
                if (typeof token !== 'undefined') {
                    var encoded = token.split('.')[1];
                    user = JSON.parse(urlBase64Decode(encoded));
                }
                return user;
            }

            var currentUser = getUserFromToken();

            return {

                signup: function(data, success, error) {
                    $http.post(urls.AUTH_REG, data).success(success).error(error)
                },

                signin: function(data, success, error) {
                     $http.post(urls.AUTH_URI, data).success(success).error(error)
                },

                getlocations: function(urls ,success, error) {
                    $http.get(urls).success(success).error(error)
                },

                //
                setcategory: function(url, data , success, error) {
                    $http({
                        method: 'POST',
                        url: url,
                        transformResponse: [function (data) {
                            return data;
                        }],
                        data: $.param(data),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(success).error(error)

                },
                //delete places.............................

                delete_plc: function(url, data, success, error) {
                    $http({
                        method: 'GET',
                        url: url+data,
                        data: $.param(data),
                        transformResponse: [function (data) {
                            return data;
                        }],
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(success).error(error)
                },

                delete_anything: function(url, data, success, error) {
                    $http({
                        method: 'DELETE',
                        url: url+data,
                        transformResponse: [function (data) {
                            return data;
                        }],
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(success).error(error)
                },

                get_with_params: function(url, success, error) {
                    $http({
                        method: 'GET',
                        url: url,
                        // data: $.param(data),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(success).error(error)
                },

                get_with_params2: function(url, data, success, error) {
                    $http({
                        method: 'GET',
                        url: url,
                        data: $.param(data),
                        // transformResponse: [function (data) {
                        //     return data;
                        // }],
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(success).error(error)
                },

                replace: function(url, success, error) {
                    $http({
                        method: 'GET',
                        url: url,
                        // data: $.param(data),
                        transformResponse: [function (data) {
                            return data;
                        }],
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(success).error(error)
                },

                //add places................................

                addaddress: function(url, data, success, error) {
                    $http({
                        method: 'POST',
                        url: url,
                        data: $.param(data),
                        transformResponse: [function (data) {
                            return data;
                        }],
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(success).error(error)
                }, 

                post_anything: function(url, data, success, error) {
                    $http({
                        method: 'POST',
                        url: url,
                        data: $.param(data),
                       
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(success).error(error)
                },

                put_something: function(url, data, success, error) {
                    $http({
                        method: 'PUT',
                        url: url,
                        // data: $.param(data),
                        transformResponse: [function (data) {
                            return data;
                        }],
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(success).error(error)
                },

                updateSomething: function(url, data, success, error) {
                    $http({
                        method: 'PATCH',
                        url: url,
                        data: $.param(data),
                        transformResponse: [function (data) {
                            return data;
                        }],
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(success).error(error)
                },

                updateSomething2: function(url, success, error) {
                    $http({
                        method: 'PATCH',
                        url: url,
                        transformResponse: [function (data) {
                            return data;
                        }],
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(success).error(error)
                },
              
                logout: function(success) {
                    changeUser({});
                    delete $localStorage.token;
                    success();
                },

                getUsers: function(query){
                    var deffered = $q.defer();
                    var data = {
                        'search' : query
                    }
                    $http.post(urls.TNT, data)
                        .success(function(data){
                        deffered.resolve(data); 
                        })
                        .error(function(data, status){
                            deffered.reject(status);
                        });
                    return deffered.promise;
                }
            };
        }]);

}());