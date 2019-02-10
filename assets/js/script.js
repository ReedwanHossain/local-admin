(function() {
    'use strict';
    var app = angular.module('barikoi', ['ui.router', 'ui.bootstrap', 'ngMaterial', 'ngMessages', 'ngStorage', 'leaflet-directive', 'angular-table', 'angularjs-datetime-picker', 'so.multiselect', 'angular-inview', 'chart.js', 'bsLoadingOverlay', 'ngImageCompress', 'cellCursor', 'pageslide-directive']);

    //All Api urls.............................................................

    app.constant('urls', {
        AUTH_URI : 'https://barikoi.xyz/v1/admin/login/',
        AUTH_REG : 'https://barikoi.xyz/v1/auth/register/',
        MAP_CODE: 'https://barikoi.xyz/v1/place/get/',
        SEARCH_CODE: 'https://barikoi.xyz/v1/place/',
        NEARBY_LOCATION: 'https://barikoi.xyz/v1/verification/nearby/place/analytics',
        ADD_CATEGORY : 'https://barikoi.xyz/v1/place/type/',
        ANALYTICS : 'https://barikoi.xyz/v1/analytics/',
        ADD_SUB_CATEGORY: 'https://barikoi.xyz/v1/place/sub/type/',
        NEW_ADDRESS : 'https://barikoi.xyz/v1/place/post/',
        GET_CATEGORY : 'https://barikoi.xyz/v1/place/get/type/',
        GET_SUB_CATEGORY : 'https://barikoi.xyz/v1/place/get/sub/type/',
        GET_SUBTYPES : 'https://barikoi.xyz/v1/place/get/all/subtype',
        DELETE_PLACE : 'https://barikoi.xyz/v1/place/delete/',
        GET_AREA : 'https://barikoi.xyz/v1/get/area',
        NEARBY_PLACE : 'https://barikoi.xyz/v1/public/place/',
        POLYGON : 'https://barikoi.xyz/v1/get/area/by/polygon',
        POLYGON_CUSTOM : 'https://barikoi.xyz/v1/get/custom/polygon?',
        POLYGON_CREATE : 'https://barikoi.xyz/v1/insert/area',
        POLYGON_UPDATE : 'https://barikoi.xyz/v1/update/area/',
        POLYGON_AREA : 'https://map.barikoi.xyz:8070/api/area',
        POLYGON_SUBAREA : 'https://map.barikoi.xyz:8070/api/subarea',
        POLYGON_SUPAREA : 'https://map.barikoi.xyz:8070/api/supersubarea',
        POLYGON_WARD : 'https://map.barikoi.xyz:8070/api/ward',
        POLYGON_ZONE : 'https://map.barikoi.xyz:8070/api/zone',
        POLYLINE_ROAD : 'https://map.barikoi.xyz:8070/api/road',
        WARDS_BY_ZONE : 'https://map.barikoi.xyz:8070/api/zone/get/wards/',
        AREA_BY_WARD : 'https://map.barikoi.xyz:8070/api/ward/get/area/',
        ROAD_BY_AREA : 'https://map.barikoi.xyz:8070/api/area/get/road/',
        SUBAREA_BY_AREA : 'https://map.barikoi.xyz:8070/api/area/get/subarea/',
        ROAD_BY_SUBAREA : 'https://map.barikoi.xyz:8070/api/subarea/get/road/',
        PLACE_BY_AREA : 'https://barikoi.xyz/v1/area/polygon?',
        PLACE_BY_TYPE : 'https://barikoi.xyz/v1/get/place/by/type?',
        PLACE_BY_ROAD : 'https://barikoi.xyz/v1/get/by/road?',
        PLACE_BY_WARD : 'https://barikoi.xyz/v1/get/by/ward?',
        TOTAL_USER : 'https://barikoi.xyz/v1/auth/admin/userlist/',
        USER_INFO : 'https://barikoi.xyz/v1/user/',
        UPDATE_PLACE : 'https://barikoi.xyz/v1/auth/place/update/',
        REWARD_LIST : 'https://barikoi.xyz/v1/admin/rewards',
        REWARD_INFO : 'https://barikoi.xyz/v1/admin/reward/',
        REWARD_REQ_LIST : 'https://barikoi.xyz/v1/admin/requests',
        REWARD_REQ_INFO : 'https://barikoi.xyz/v1/admin/requests/',
        REWARD_REQ_INFO : 'https://barikoi.xyz/v1/admin/requests/',
        REWARD_REQ_UPDATE : 'https://barikoi.xyz/v1/admin/requests/update/',
        RIDE_LIST : 'https://barikoi.xyz/v1/rides',
        VAHICLE_LIST : 'https://barikoi.xyz/v1/pool/providers/',
        TOUR_LIST : 'https://barikoi.xyz/v1/ghurbokoi',
        SET_ORDER : 'https://barikoi.xyz/v1/order/',
        ORDER_LIST : 'https://barikoi.xyz/v1/order/all',
        ONGOING_ORDER_LIST : 'https://barikoi.xyz/v1/order/ongoing/all',
        DELIVERED_ORDER_LIST : 'https://barikoi.xyz/v1/order/delivered/all',
        CANCELLED_ORDER_LIST : 'https://barikoi.xyz/v1/order/cancelled/all',
        ORDER_DELETE : 'https://barikoi.xyz/v1/order/delete/',
        ORDER_UPDATE : 'https://barikoi.xyz/v1/order/update/',
        DELIVERMAN_LIST : 'https://barikoi.xyz/v1/get/deliveryman',
        TRACK_DELIVERMAN : 'https://barikoi.xyz/v1/get/delivery/man/location/for/admin',
        ASSIGN_DELIVERMAN : 'https://barikoi.xyz/v1/order/assign?',
        DTOOL_ADD_PLACE: 'https://barikoi.xyz/v1/test/auth/place/newplace/mapper/',
        CONTRIBUTER_LIST: 'https://barikoi.xyz/v1/contributor/',
        CONTRIBUTER_PLACE: 'https://barikoi.xyz/v1/places/contributor/',
        SINGLE_IMAGE: 'https://barikoi.xyz/v1/image/',
        DROP_MARKER: 'https://barikoi.xyz/v1/drop/update/',
        DEMO_PAGI: 'https://barikoi.xyz/v1/paginate?page=',
        BIKE: 'https://barikoi.xyz/v1/bike/',
        RENT: 'https://barikoi.xyz/v1/rent/',
        LOGISTISC: 'https://barikoi.xyz/v1/logistic/',
        REPLACE: 'https://barikoi.xyz/v1/replace',
        REPLACE_WORD: 'https://barikoi.xyz/v1/updateword',
        TNT:'https://barikoi.xyz/v1/tnt/search',
        DNCC_TL:'https://barikoi.xyz/v1/tradelicense',

    });


    //List Of All ui-routes...................................................

    app.config(function($stateProvider, $urlRouterProvider, $httpProvider, ChartJsProvider, $mdDateLocaleProvider) {
        ChartJsProvider.setOptions({ colors : [ '#46BFBD', '#DCDCDC', '#00ADF9', '#803690', '#FDB45C', '#949FB1', '#4D5360'] });
        $urlRouterProvider.otherwise('/polygon/studio/area');
        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('YYYY-MM-DD');
        };

        $stateProvider

            .state('main', {
                abstract : true,
                url: '',
                templateUrl: 'examples/sidebar.html',
                controller: 'MainController',
                authentication : true
            })

           
            .state('main.polygon', {
                url: '/polygon',
                templateUrl: 'examples/polygon.html',
                controller: 'Polygon',
                authentication : true
            })

            .state('main.polySearch', {
                url: '/polygon/area/search',
                templateUrl: 'examples/polygon-search.html',
                controller: 'PolygonSearch',
                authentication : true
            })

            .state('main.polygonStudio', {
                url: '/polygon/studio',
                templateUrl: 'examples/polygon-studio.html',
                controller: 'PolygonStudio',
                authentication : true
            })

            .state('main.polygonArea', {
                url: '/polygon/area',
                templateUrl: 'examples/polygonStd-area.html',
                controller: 'PolygonArea',
                authentication : true
            })

            .state('main.polygonStdArea', {
                url: '/polygon/studio/area',
                templateUrl: 'examples/polygonStd-area.html',
                controller: 'PolygonStdArea',
                authentication : true
            })

            .state('main.polygonSubArea', {
                url: '/polygon/subarea',
                templateUrl: 'examples/polygonStd-subarea.html',
                controller: 'PolygonSubArea',
                authentication : true
            })

            .state('main.polygonStdSubArea', {
                url: '/polygon/studio/subarea',
                templateUrl: 'examples/polygonStd-subarea.html',
                controller: 'PolygonStdSubArea',
                authentication : true
            })


            .state('main.polygonSupArea', {
                url: '/polygon/suparea',
                templateUrl: 'examples/polygonStd-suparea.html',
                controller: 'PolygonSupArea',
                authentication : true
            })

            .state('main.polygonStdSupArea', {
                url: '/polygon/studio/suparea',
                templateUrl: 'examples/polygonStd-suparea.html',
                controller: 'PolygonStdSupArea',
                authentication : true
            })

            .state('main.polygonWard', {
                url: '/polygon/ward',
                templateUrl: 'examples/polygonStd-ward.html',
                controller: 'PolygonWard',
                authentication : true
            })

            .state('main.polygonStdWard', {
                url: '/polygon/studio/ward',
                templateUrl: 'examples/polygonStd-ward.html',
                controller: 'PolygonStdWard',
                authentication : true
            })

            .state('main.polygonStdZone', {
                url: '/polygon/studio/zone',
                templateUrl: 'examples/polygonStd-zone.html',
                controller: 'PolygonStdZone',
                authentication : true
            })

            .state('main.polygonZone', {
                url: '/polygon/zone',
                templateUrl: 'examples/polygonStd-zone.html',
                controller: 'PolygonZone',
                authentication : true
            })

            .state('main.polylineStdRoad', {
                url: '/polyline/studio/road',
                templateUrl: 'examples/polygonStd-road.html',
                controller: 'PolygonlineStdRoad',
                authentication : true
            })

            .state('main.polylineRoad', {
                url: '/polyline/road',
                templateUrl: 'examples/polygonStd-road.html',
                controller: 'PolylineRoad',
                authentication : true
            });


        //Intercepts every http request and Response......................................................
        //
        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    // if ($localStorage.token && config.url.startsWith('https://barikoi.xyz')) {
                    //     config.headers.Authorization = 'Bearer ' + $localStorage.token; //sends authorization header for every subsequent request to server
                    // }
                    return config;
                }
            };
        }])


     }).run(function ($rootScope, $state, $localStorage, $location, $anchorScroll, bsLoadingOverlayService, cellEditorFactory) {
    
            bsLoadingOverlayService.setGlobalConfig({
                templateUrl: 'examples/loading-overlay-template.html'
            });

            cellEditorFactory['boolean'] = {
            // cell key event handler
            cellKey:function(event, options, td, cellCursor){
              if(event.type=='keydown'){
                switch(event.which){
                case 13:
                case 32:
                  event.stopPropagation();
                  options.setValue(!options.getValue());
                  return true;
                }
              }
            },
            // editor open handler
            open:function(options, td, finish, cellEditor){
                options.setValue(!options.getValue());
                finish();
            }
          };
    
            $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
                 $anchorScroll();
    
            });
        });
}());