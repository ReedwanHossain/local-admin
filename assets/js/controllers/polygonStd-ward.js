    (function() {
        'use strict';

        angular
            .module('barikoi')
            .controller('PolygonStdWard', PolygonStdWard);

        PolygonStdWard.$inject = ['$scope', '$modal', '$http', '$stateParams', '$window', '$location', '$timeout', 'leafletData', 'urls', 'Auth', 'DataTunnel', 'bsLoadingOverlayService'];

        function PolygonStdWard($scope, $modal, $http, $stateParams, $window, $location, $timeout, leafletData, urls, Auth, DataTunnel, bsLoadingOverlayService) {
            // $scope.coordinates=[];

            var drawnItems = new L.FeatureGroup();
          
               Auth.getlocations(urls.POLYGON_ZONE+'?', function(res) {
               $scope.zones = res;
                 
            },
             function() {
                
            });

               Auth.getlocations(urls.POLYGON_WARD+'?', function(res) {
           $scope.wards = res;
             
        },
         function() {
            
        });
               

           

        angular.extend($scope, {
          center: {
              lat: 23.728783,
              lng: 90.393791,
              zoom: 12,

            },
             // controls: {
             //            draw: {}
             //        },
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
                          
                        }
                    }
                });

                leafletData.getMap().then(function(map) {
            $timeout(function() {
                map.invalidateSize();
                //create bounds
            }, 500);
            map.addLayer(drawnItems);


            // Set the title to show on the polygon button
            L.drawLocal.draw.toolbar.buttons.polygon = 'Draw a sexy polygon!';

            var drawControl = new L.Control.Draw({
                position: 'topleft',
                draw: {
                    // polyline: {
                    //     metric: true
                    // },
                    polygon: {
                        // allowIntersection: true,
                        // showArea: true,
                        drawError: {
                            color: '#b00b00',
                            timeout: 1000
                        },
                        shapeOptions: {
                            color: '#bada55'
                        }
                    },
                    circle: {
                        shapeOptions: {
                            color: '#662d91'
                        }
                    },
                    marker: false
                },
                edit: {
                    featureGroup: drawnItems,
                    remove: false
                }
            });
            map.addControl(drawControl);

            map.on('draw:created', function(e) {
                var type = e.layerType,
                    layer = e.layer;
                console.log(layer)
                var layer = e.layer;
                drawnItems.addLayer(layer);
                //console.log(JSON.stringify(layer.toGeoJSON().geometry.coordinates[0]));
                var array = [];
                layer.toGeoJSON().geometry.coordinates[0].map(function(ary) {

                    array.push(ary.join(' '));
                });
                $scope.coordinates = array.reduce(
                    (accumulator, currentValue) => accumulator.concat(currentValue),
                    []
                );



                DataTunnel.set_data($scope.coordinates);

                var modalInstance = $modal.open({
                    //templateUrl: '/local/examples/polygon-area-mod.html',
                    templateUrl: '/../../examples/polygon-ward-mod.html',
                    controller: 'PolygonModal',
                    size: 'lg',
                    scope: $scope
                });

                drawnItems.addLayer(layer);
            });

            map.on('draw:edited', function(e) {
                var layer = e.layers;
                //drawnItems.addLayer(layer);
                //console.log(JSON.stringify(layer.toGeoJSON().geometry.coordinates[0]));
                var array = [];
                console.log(layer.toGeoJSON())
                layer.toGeoJSON().features[0].geometry.coordinates[0].map(function(ary) {

                    array.push(ary.join(' '));
                });
                $scope.coordinates = array.reduce(
                    (accumulator, currentValue) => accumulator.concat(currentValue),
                    []
                );



                swal({
                        title: "Are you sure?",
                        // text: "You will not be able to recover this imaginary file!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, update Ward Poligon!",
                        closeOnConfirm: false
                    },
                    function() {
                        var data = {
                            ward_area: $scope.coordinates.toString()
                        };
                        Auth.updateSomething(
                            urls.POLYGON_WARD + "/" + $scope.id,
                            data,
                            function(res) {
                                swal("Done", "Ward Polygon updated");
                            },
                            function() {
                                swal("Error");
                            }
                        );
                    }
                );
                // var countOfEditedLayers = 0;
                // layers.eachLayer(function(layer) {
                //   countOfEditedLayers++;
                // });
                // console.log("Edited " + countOfEditedLayers + " layers");
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


    $scope.set_ward = function(zone) {

            DataTunnel.set_data(zone);
            console.log(zone);

            $scope.id = zone['id'];

            $scope.Feature = []
            var coordinates = [];
            var temp = []
            var polyjson = JSON.parse(zone['ST_AsGeoJSON(ward_area)']);
            temp.push(polyjson.coordinates);
            coordinates = temp;
            console.log(polyjson.coordinates)
            var polyLayers = [];

            //AKhane problem may be
            console.log(polyjson.coordinates[0])
            for (var i = polyjson.coordinates[0].length; i--;) {
                var temp = polyjson.coordinates[0][i][0];
                polyjson.coordinates[0][i][0] = polyjson.coordinates[0][i][1];
                polyjson.coordinates[0][i][1] = temp;
                console.log("loop")
            }

            console.log("after the loop")
            var polyline1 = L.polygon(polyjson.coordinates).bindPopup(zone.id);
            // var polyline1 = L.polyline([
            //     [90.512642, 23.099993],
            //     [90.520387, 23.087633],
            //     [90.509116, 23.082483]
            // ]);
            // polyLayers.push(polyline1)
            drawnItems.addLayer(polyline1);

            // Add the layers to the drawnItems feature group 
            // for(var layer of polyLayers) {
            //   drawnItems.addLayer(layer); 
            // }


            // $scope.Feature.push({
            //     "type": "Feature",
            //     "properties": {
            //       "name": road.road_name_number,
            //       "number_of_lanes" : road.number_of_lanes,
            //       "road_condition" : road.road_condition,

            //     },
            //     "geometry": {
            //       "type": "LineString",
            //       "coordinates": polyjson.coordinates
            //     }
            //   });


            //$scope.areas.push({ id: -1, name: "all", 'ST_AsGeoJSON(area)': JSON.stringify({ 'type': "Polygon", 'coordinates': coordinates }) });

            angular.extend($scope, {
                center: {
                    lat: polyjson.coordinates[0][0][0],
                    lng: polyjson.coordinates[0][0][1],
                    zoom: 14,

                },
                // geojson : {
                //     data: {
                //       "type": "FeatureCollection",
                //       "features": $scope.Feature
                //     },
                //     style: style,
                //     onEachFeature: onEachFeature 
                // },
                // selectedRoad : {},

                //  events: {
                //     geojson: {
                //         enable: [ 'click', 'mouseover' ]
                //     }
                // },


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
