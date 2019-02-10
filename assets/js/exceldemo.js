(function() {
  'use strict';

  angular
    .module('barikoi')
.controller("rootCtrl",["$scope", "$timeout", "urls", "Auth", "DataTunnel", "bsLoadingOverlayService",function($scope, $timeout, urls, Auth, DataTunnel, bsLoadingOverlayService){
  // override keydown event by ng-keydown
  bsLoadingOverlayService.start({
        referenceId: 'first'
    });

  $scope.keydown=function(e){
    if(e.keyCode==9){
      console.log($scope.exportSelected());
      e.stopImmediatePropagation();
    }
  }
  // event on cellCursor initalized.
  $scope.$on("cellCursor",function(e,cellCursor,name){
    // set padding. padding is no selectable area.
    cellCursor.padding.left=1;
    cellCursor.padding.right=1;
    // select by script
    cellCursor.select({row:1,col:0},{row:2,col:2});

    // drag and drop handlers from `cell-cursor-drag` directive
    cellCursor.$on("cellCursor.drag.start",function(e,pos){
      if(!cellCursor.selected.cursor || cellCursor.selected.topLeft.row>pos.row || pos.row>cellCursor.selected.bottomRight.row){
        cellCursor.select({row:pos.row,col:0},{row:pos.row,col:cellCursor.size().col});
      }else{
        e.preventDefault()
      }
    });
    cellCursor.$on("cellCursor.drag",function(e, pos, tpos){
      if(pos.row!=tpos.row){
        var s = $scope.userList.splice(pos.row + $scope.start,cellCursor.selected.bottomRight.row-cellCursor.selected.topLeft.row+1);
        $scope.userList.splice.apply($scope.userList,[tpos.row + $scope.start,0].concat(s));
        pos.row = tpos.row;
      }else{
        e.preventDefault();
      }
    })
  });
  // fetch row datas
  $scope.exportSelected=function(){

    var pos = $scope.cc.selected;
    if(pos.cursor){
      var ret = [];
      for(var i=pos.topLeft.row;i<=pos.bottomRight.row;i++){
        ret.push($scope.userList[i+$scope.start]);
      }
      DataTunnel.set_data(ret);
      return ret;
    }
  }

  // stop drag&drop if order is not natural
  $scope.dragable = function(){
    return !($scope.query||$scope.sort);
  };
  /** */
  $scope.changeSort = function(name){
    $scope.cc.deselect();
    if($scope.sort==name){
      $scope.sort='-'+name;
    }else if($scope.sort=='-'+name){
      $scope.sort='';
    }else{
      $scope.sort=name;
    }
  }

  // create datas
  $scope.start = 0;
  $scope.starts = [];
  for(var i=0;i<1000;i+=10){
    $scope.starts.push(i);
  }
  $scope.sort ='';
  $scope.limit = 30;
  $scope.query = "";
  $scope.userList=[];
  $scope.cols = [0,1,2,3,4];
  $scope.log=function(msg){
    console.log(msg);
  }
  // setter sample
  $scope.userNameSetter=function(user){
    return function(val){
      console.log('setter user.name',user.name,val);
      user.name=val;
    }
  };
  // getter sample
  $scope.userNameGetter=function(user){
    return function(val){
      console.log('getter user.name',user.name,val);
      return user.name;
    }
  };
  // setter with validation sample
  $scope.emailSetter=function(user){
    return function(val){
      if(!val)return;
      val = (val||"").toString();
      if(val.indexOf("@")==-1) return;
      user.email=val;
    }
  };

  function User(obj){
    for(var i in obj){
      this[i]=obj[i];
    }
  }
  // getterSetter for ng-model
  User.prototype.nameSet=function(name){
    if(arguments.length){
      this.name = name;
    }else{
      return this.name;
    }
  }
  // for(var i=0;i<1000;i++){
  //   $scope.userList.push(new User({
  //     id:i,
  //     name:"hoge"+i,
  //     age:Math.floor(Math.random()*20+20),
  //     admin:true,
  //     email:"hoge"+i+"@example.com"
  //   }));
  // }
  Auth.getlocations(urls.ORDER_LIST, function(res) {
             $timeout(function(){
                  
                    bsLoadingOverlayService.stop({
                        referenceId: 'first'
                    });
                    $scope.userList = res;
              }, 2000);
        },
         function() {
            $rootScope.error = 'Failed to fetch data';
            $timeout(function(){
                    bsLoadingOverlayService.stop({
                        referenceId: 'first'
                    });
                    swal($rootScope.error);
                }, 2000);
  });


  // $scope.userList[5].name="bad";

  $scope.isError=function(user){
    return user.name == "bad";
  };

  // delete click handler
  $scope.delete=function(user){
    var i = $scope.userList.indexOf(user);
    if(i!=-1){
      $scope.userList.splice(i,1);
    }
  }
  $scope.setStart=function(x){
    $scope.start = Math.min(Math.max(Math.floor(x/10)*10,0),$scope.userList.length-$scope.limit);
  }
}]).controller("sliderCtrl",['$scope',function($scope){
  // dirty slider impliment. it is example...
  var $ = angular.element;
  $scope.container=function(e){
    if(e.target.id!='slider-box')return;
    var r = e.target.getBoundingClientRect();
    var x = (e.pageX - r.left)*$scope.userList.length / r.width;
    $scope.setStart(x-$scope.limit/2);
  }
  $scope.slider=function(e){
    var r = e.target.parentNode.getBoundingClientRect();
    var base = e.pageX, s = $scope.start;
    e.stopPropagation();
    function handler(e){
      $scope.$apply(function(){
        $scope.setStart(s+((e.pageX - base)*$scope.userList.length/r.width));
      });
    }
    $(document).on('mousemove',handler).one('mouseup',function(e){
      $(document).off('mousemove',handler);
    });
  }
}]);
  
}());