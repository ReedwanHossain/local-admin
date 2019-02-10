(function() {
    'use strict';

    angular
        .module('barikoi')
        .controller('PolygonSubArea', PolygonSubArea);
        
    PolygonSubArea.$inject = ['$scope', '$http', '$stateParams', '$window', '$location', '$timeout', 'leafletData', 'urls', 'Auth', 'DataTunnel', 'bsLoadingOverlayService'];

    function PolygonSubArea($scope, $http, $stateParams, $window, $location, $timeout, leafletData, urls, Auth, DataTunnel, bsLoadingOverlayService) {
        
       

           Auth.getlocations(urls.POLYGON_SUBAREA+'?', function(res) {
           $scope.subareas = res;
             
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
                        confirmButtonText: "Yes, update Subrea Poligon!",   
                        closeOnConfirm: false }, 
                        function(){
                        var data = {
                              area : coordinates.toString()
                            }   
                            Auth.updateSomething(urls.POLYGON_SUBAREA+'/'+$scope.id, data, function(res) {
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
    


    $scope.set_subarea = function(subarea) {
      // console.log(zone);
      // var polyjson = JSON.parse(zone['ST_AsGeoJSON(ward_area)']);
      // console.log(polyjson);
      $scope.id = subarea['id'];

    
            var coordinates = [];
            var temp = []
            var polyjson = JSON.parse(subarea['ST_AsGeoJSON(subarea_area)']);
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
                    style: {
                       
                            weight: 2,
                            opacity: 1,
                            color: 'green',
                            dashArray: '1',
                            fillOpacity: 0
                    }
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