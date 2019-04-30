(function() {
    'use strict';

    angular
        .module('barikoi')
        .controller('PolylineRoad', PolylineRoad);
        
    PolylineRoad.$inject = ['$scope', '$http', '$stateParams', '$window', '$location', '$timeout', '$modal', 'leafletData', 'urls', 'Auth', 'DataTunnel', 'bsLoadingOverlayService'];

    function PolylineRoad($scope, $http, $stateParams, $window, $location, $timeout, $modal, leafletData, urls, Auth, DataTunnel, bsLoadingOverlayService) {
        
           var modalInstance;

              $scope.roadtypes = [{
        key: '8',
        name: 'Asphalt'
    }, {
        key: '9',
        name: 'Concrete'
    }, {
        key: '10',
        name: 'Unpaved'
    }, {
        key: '11',
        name: 'Good'
    }, {
        key: '12',
        name: 'Bad'
    }, {
        key: '13',
        name: 'Disaster'
    }];

           $scope.set_area = function(area) {
            Auth.getlocations(urls.ROAD_BY_AREA+area.id+'?', function(res) {
              $scope.roads =res;
            },function(err) {

            });
        };


           Auth.getlocations(urls.POLYGON_AREA, function(res) {
           $scope.areas = res;
             
        },
         function() {
            
        });

        $scope.onRoadSelect = function(selectedItem) {
        $scope.road_type = selectedItem;
      
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
                     layer.toGeoJSON().geometry.coordinates.map(function(ary) {
                      
                       array.push(ary.join(' '));
                     });
                     var coordinates = array.reduce(
                      ( accumulator, currentValue ) => accumulator.concat(currentValue),
                      []
                    );

                     var data = {
                        id : DataTunnel.get_data().id,
                        poly : coordinates
                     }
                      DataTunnel.set_data(data);


                      modalInstance = $modal.open({
                        //templateUrl: '/local/examples/polyline-road-mod.html',
                        templateUrl: '/../../examples/polyline-road-up-mod.html',
                        controller: 'PolygonModal',
                        size: 'lg',
                        scope: $scope
                    });
                    
                //       swal({  
                //         title: "Are you sure?",   
                //         // text: "You will not be able to recover this imaginary file!",   
                //         type: "warning",   
                //         showCancelButton: true,   
                //         confirmButtonColor: "#DD6B55",   
                //         confirmButtonText: "Yes, update Road Polyline!",   
                //         closeOnConfirm: false }, 
                //         function(){
                //         var data = {
                //               road : coordinates.toString()
                //             }   
                //             Auth.updateSomething(urls.POLYLINE_ROAD+'/'+$scope.id, data, function(res) {
                //         swal("Done", "Polyline updated");
                //     },function() {
                //         swal("Error")
                //     }) 

                // });
                  });
               });
           });

            function onEachFeature(feature, layer) {
    //bind click
    layer.on({
        click: whenClicked
    });
}

   function whenClicked(e) {
  // e = event
  // console.log(e.target.feature.properties.name)
  // swal(e.target.feature.properties.name, '')
  var data = {
                        id : DataTunnel.get_data().id,
                        name : e.target.feature.properties.name
                     }
                      DataTunnel.set_data(data);


                      modalInstance = $modal.open({
                        //templateUrl: '/local/examples/polyline-road-mod.html',
                        templateUrl: '/../../examples/polyline-name-up-mod.html',
                        controller: 'PolygonModal',
                        size: 'lg',
                        scope: $scope
                    });
  // toaster.pop('success', e.target.feature.properties.name);
  // You can make your ajax call declaration here
  //$.ajax(... 
}


function getColor(road) {
                if (road.properties.road_condition.includes('Good')) {
                  return '#55AA55'
                }

                else if (road.properties.road_condition.includes('Bad')) {
                  return '#D4A76A'
                }

                else if (road.properties.road_condition.includes('Disaster')) {
                  return '#D46A6A'
                }

              else{
                return '#4F628E'
              }
            }



  function style(feature) {
                return {
                    fillColor: getColor(feature),
                    opacity: 2,
                    weight: 3,
                    color: getColor(feature),
                    dashArray: '',
                    fillOpacity: 0.7
                };
            }
    


    $scope.set_road = function(road) {

       DataTunnel.set_data(road);
       console.log(road);
    
      $scope.id = road['id'];

            $scope.Feature =[]
            var coordinates = [];
            var temp = []
            var polyjson = JSON.parse(road['ST_AsGeoJSON(road_geometry)']);
             temp.push(polyjson.coordinates);
            coordinates = temp;
            

            $scope.Feature.push({
                "type": "Feature",
                "properties": {
                  "name": road.road_name_number,
                  "number_of_lanes" : road.number_of_lanes,
                  "road_condition" : road.road_condition,

                },
                "geometry": {
                  "type": "LineString",
                  "coordinates": polyjson.coordinates
                }
              });

            
            //$scope.areas.push({id: -1, name:"all", 'ST_AsGeoJSON(area)': JSON.stringify({'type': "Polygon", 'coordinates': coordinates})});
     
      angular.extend($scope, {
        center: {
          lat: coordinates[0][0][1],
          lng: coordinates[0][0][0],
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
                selectedRoad : {},

                 events: {
                    geojson: {
                        enable: [ 'click', 'mouseover' ]
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