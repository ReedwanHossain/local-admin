(function() {
    'use strict';

    angular
        .module('barikoi')
        .controller('PolygonArea', PolygonArea);
        
    PolygonArea.$inject = ['$scope', '$http', '$stateParams', '$window', '$location', '$timeout', 'leafletData', 'urls', 'Auth', 'DataTunnel', 'bsLoadingOverlayService'];

    function PolygonArea($scope, $http, $stateParams, $window, $location, $timeout, leafletData, urls, Auth, DataTunnel, bsLoadingOverlayService) {
        
       
          $scope.areas = [{key:1, name: 'Mirpur'}];
           Auth.getlocations(urls.POLYGON_AREA, function(res) {

                    $scope.areas= [];
                    res.map(function(res) {
                        var polyjson = res['ST_AsGeoJSON(area_area)'];
                        $scope.areas.push({key: res.id, name: res.area_name, pgon: polyjson})
                    });
                    $scope.areas.push({key: -1, name: 'clear', pgon: 'nai'});
                    //console.log($scope.subcategories);

                 },
         function() {
            
        });


         $scope.onSelected = function(field, selectedItem) {
        console.log(selectedItem);
        if (selectedItem[selectedItem.length-1].key < 0) {
           selectedItem.map(function(area) {
              area.selected = false;
           });
           angular.extend($scope, {
        
                geojson : {
                    data: {
                      "type": "FeatureCollection",
                      "features": []
                    },
                    // style: style,
                },


            });
           return 
        }
         $scope.Feature =[];
         var coordinates = [];
            var temp = [];

        selectedItem.map(function(road,k) {   
              var polyjson = JSON.parse(road.pgon);
              
              $scope.Feature.push({
                "type": "Feature",
                "properties": {
                  "name": road.area_name,
                  "ward_id" : road.ward_id
                },
                "geometry": {
                  "type": "Polygon",
                  "coordinates": polyjson.coordinates
                }
              });



             temp.push(polyjson.coordinates);
         });
         coordinates = temp;

         if (selectedItem.length>0) {
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
                },


            });
         }else{
             angular.extend($scope, {
        
                geojson : {
                    data: {
                      "type": "FeatureCollection",
                      "features": []
                    },
                    // style: style,
                },


            });
         }
    };
        


    angular.extend($scope, {
      center: {
          lat: 23.728783,
          lng: 90.393791,
          zoom: 12,

        },
         controls: {
                    draw: {}
                },
    events: {
        map: {
            enable: ['moveend', 'popupopen'],
            logic: 'emit'
        },
        // marker: {
        //    enable: [ 'click', 'dblclick', 'dragend' ],
        //     logic: 'emit'
        // }
    },
      layers: {
                    baselayers: {
                        
                         bkoi: {
                            name: 'barikoi',
                            url: 'http://map.barikoi.xyz:8080/styles/klokantech-basic/{z}/{x}/{y}.png',
                            type: 'xyz',
                            layerOptions: {
                                attribution: 'Barikoi',
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
               leafletData.getLayers().then(function(baselayers) {
                  var drawnItems = baselayers.overlays.draw;
                  map.on('draw:created', function (e) {
                    var layer = e.layer;
                    drawnItems.addLayer(layer);
                     //console.log(JSON.stringify(layer.toGeoJSON().geometry.coordinates[0]));
                      var array = [];
                     layer.toGeoJSON().geometry.coordinates[0].map(function(ary) {
                      
                       array.push(ary.join(' '));
                     });
                     var coordinates = array.reduce(
                      ( accumulator, currentValue ) => accumulator.concat(currentValue),
                      []
                    );
                    
                      swal({  
                        title: "Are you sure?",   
                        // text: "You will not be able to recover this imaginary file!",   
                        type: "warning",   
                        showCancelButton: true,   
                        confirmButtonColor: "#DD6B55",   
                        confirmButtonText: "Yes, update Area Poligon!",   
                        closeOnConfirm: false }, 
                        function(){
                        var data = {
                              area_area : coordinates.toString()
                            }   
                            Auth.updateSomething(urls.POLYGON_AREA+'/'+$scope.id, data, function(res) {
                        swal("Done", "Polygon updated");
                    },function() {
                        swal("Error")
                    }) 

                });
                  });
               });
           });
   
leafletData.getMap().then(function(map) {
              $timeout(function() {
                map.invalidateSize();
                //create bounds
              }, 500);
            });

function getColor() {
                var o = Math.round, r = Math.random, s = 255;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s)+')';
    //return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';

            }



  function style(feature) {
                return {
                    fillColor: getColor(),
                    opacity: 2,
                    color: getColor(),
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            }
    


    $scope.set_area = function(area) {
      // console.log(zone);
      // var polyjson = JSON.parse(zone['ST_AsGeoJSON(ward_area)']);
      // console.log(polyjson);
      $scope.id = area['id'];

    
            var coordinates = [];
            var temp = []
            var polyjson = JSON.parse(area['ST_AsGeoJSON(area_area)']);
              // console.log(polyjson.coordinates);
             temp.push(polyjson.coordinates);
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
                      "features": [
                        {
                          "type": "Feature",
                          "properties": {},
                          "geometry": {
                            "type": "MultiPolygon",
                            "coordinates": coordinates
                          }
                        }
                      ]
                    },
                    style: style
                },


            });

    };

    


    

  $scope.openSlide = function() {
      $scope.toggle = !$scope.toggle;
    };

    $scope.changeCenter = function(marker) {
                $scope.center.lat = marker.lat;
                $scope.center.lng = marker.lng;
            };
    
  }

}());