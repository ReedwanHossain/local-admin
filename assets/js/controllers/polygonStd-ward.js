    (function() {
        'use strict';

        angular
            .module('barikoi')
            .controller('PolygonStdWard', PolygonStdWard);

        PolygonStdWard.$inject = ['$scope', '$modal', '$http', '$stateParams', '$window', '$location', '$timeout', 'leafletData', 'urls', 'Auth', 'DataTunnel', 'bsLoadingOverlayService'];

        function PolygonStdWard($scope, $modal, $http, $stateParams, $window, $location, $timeout, leafletData, urls, Auth, DataTunnel, bsLoadingOverlayService) {
            // $scope.coordinates=[];

            
          
               Auth.getlocations(urls.POLYGON_ZONE+'?', function(res) {
               $scope.zones = res;
                 
            },
             function() {
                
            });
               

           

        angular.extend($scope, {
          center: {
              lat: 23.728783,
              lng: 90.393791,
              zoom: 12,

            },
             controls: {
                        draw: {}
                    },
          layers: {
                        baselayers: {
                            bkoi: {
                            name: 'barikoi',
                            url: 'http://map.barikoi.xyz:8080/styles/klokantech-basic/{z}/{x}/{y}.png',
                            type: 'xyz',
                            layerOptions: {
                                maxZoom: 23
                            },
                        },
                          mapbox_light: {
                                name: 'Mapbox Streets',
                                url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                                type: 'xyz',
                                layerOptions: {
                                    apikey: 'pk.eyJ1Ijoicmhvc3NhaW4iLCJhIjoiY2o4Ymt0NndlMHVoMDMzcnd1ZGs4dnJjMSJ9.5Y-mrWQCMXqWTe__0J5w4w',
                                    mapid: 'mapbox.streets',
                                    maxZoom: 23
                                    
                                },
                                layerParams: {
                                    showOnSelector: true
                                }
                            },
                            osm: {
                                name: 'OpenStreetMap',
                                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                                type: 'xyz',
                                layerOptions: {
                                    maxZoom: 23
                                },
                            }
                            
                            
                        },
                        overlays: {
                            draw: {
                                name: 'draw',
                                type: 'group',
                                visible: true,
                                layerParams: {
                                    showOnSelector: false
                                }
                            }
                        }
                    }
                });

                leafletData.getMap().then(function(map) {
                  $timeout(function() {
                    map.invalidateSize();
                    //create bounds
                  }, 500);
                });



      leafletData.getMap().then(function(map) {
                   leafletData.getLayers().then(function(baselayers) {
                      var drawnItems = baselayers.overlays.draw;
                      map.on('draw:created', function (e) {
                        var layer = e.layer;
                        drawnItems.addLayer(layer);
                         //console.log(JSON.stringify(layer.toGeoJSON().geometry.coordinates[0]));
                          var array = [];
                          console.log(layer)
                         layer.toGeoJSON().geometry.coordinates[0].map(function(ary) {
                          
                           array.push(ary.join(' '));
                         });
                         console.log(array);
                         $scope.coordinates = array.reduce(
                          ( accumulator, currentValue ) => accumulator.concat(currentValue),
                          []
                        );

                         
                         
                         DataTunnel.set_data($scope.coordinates);

                         var modalInstance = $modal.open({
                    //templateUrl: '/local/examples/polygon-ward-mod.html',
                    templateUrl: '/../../examples/polygon-ward-mod.html',
                    controller: 'PolygonModal',
                    size: 'lg',
                    scope: $scope
                });

                        
                          // swal({
                          //     title: "Polygon Name?",
                          //     type: "input",
                          //     showCancelButton: true,   
                          //     closeOnConfirm: false,
                          //     inputPlaceholder: "Ex: Mirpur-2, Banani etc"
                          //   }, function (inputValue) {
                          //     if (inputValue === false) return false;
                          //     if (inputValue === "") {
                          //       swal.showInputError("Only tagging is real!");
                          //       return false
                          //     }
                          //       var data = {
                          //         area : coordinates.toString(),
                          //         name : inputValue
                          //       }
                          //       Auth.post_anything(urls.POLYGON_CREATE, data, function(res) {
                          //         console.log(res);
                          //          swal("Nice!", "New Polygon Inserted ", "success");
                          //       },function() {
                                  
                          //       })

                          //   });
                      });
                   });
               });

      function getColor() {
                var o = Math.round, r = Math.random, s = 255;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s)+')';
            }

function whenClicked(e) {
  // console.log(e)
  //console.log(e.target.feature.properties.key)
  swal('Ward Number: '+e.target.feature.properties.name, '')
  $scope.id = e.target.feature.properties.key
  // toaster.pop('success', e.target.feature.properties.name);
  // You can make your ajax call declaration here
  //$.ajax(... 
   var center = e.feature.getBounds().getCenter();
   console.log(center);

}


function onEachFeature(feature, layer) {
    //bind click
    layer.on({
        click: whenClicked
    });
}


  function style(feature) {
                return {
                    fillColor: getColor(),
                    opacity: 2,
                    color: getColor(),
                    dashArray: '3',
                    fillOpacity: 0.7,
                    title: "name"
                };
            }


          $scope.set_zone = function(zone) {
      // console.log(zone);
      // var polyjson = JSON.parse(zone['ST_AsGeoJSON(ward_area)']);
      // console.log(polyjson);
      $scope.id = zone['id'];

      Auth.getlocations(urls.WARDS_BY_ZONE+$scope.id+'?', function(res) {
            $scope.roads = res;
            var coordinates = [];
            var temp = [];
             $scope.Feature =[]
            $scope.roads.map(function(road,k) {   
              var polyjson = JSON.parse(road['ST_AsGeoJSON(ward_area)']);
              
              $scope.Feature.push({
                "type": "Feature",
                "properties": {
                  "name": road.ward_number,
                },
                "geometry": {
                  "type": "Polygon",
                  "coordinates": polyjson.coordinates
                }
              });
               temp.push(polyjson.coordinates);

            });
            
            coordinates = temp;
            console.log(coordinates);
            
            //$scope.areas.push({id: -1, name:"all", 'ST_AsGeoJSON(area)': JSON.stringify({'type': "Polygon", 'coordinates': coordinates})});
     
      angular.extend($scope, {
        center: {
          lat: coordinates[0][0][0][1],
          lng: coordinates[0][0][0][0],
          zoom: 14,

        },

             geojson : {
                    data: {
                      "type": "FeatureCollection",
                      "features": $scope.Feature
                    },
                    style: style,
                    onEachFeature: onEachFeature
                },


            });

        
   
            
        },
             function() {
                
            });
     
    };



               


        $scope.changeCenter = function(marker) {
                    $rootScope.center.lat = marker.lat;
                    $rootScope.center.lng = marker.lng;
                };

         $scope.openSlide = function() {
          $scope.toggle = !$scope.toggle;
        };


        
      }

    }());
