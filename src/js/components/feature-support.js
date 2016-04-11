// feature.js

app.directive('featureSupport', function() {
  return {
    restrict : 'E',
    templateUrl : 'templates/feature-support.html',
    controller : 'featureController',
    scope : {
      'feature' : '=featureObj'
    }
  };
});

app.controller("featureController", ['$scope', 'caniuse', 'settings', function($scope, caniuse, settings){





  $scope.state = null;
  $scope.hoveredStat = null;
  $scope.hoveredUsage = null;

  $scope.isNumber = angular.isNumber;
  $scope.caniuse = caniuse;
  $scope.settings = null;

  $scope.recompileData = function(){
    $scope.stats = $scope.feature.getGlobalStats();
  };

  settings.get(function(sets){
    $scope.settings = settings;
    $scope.$applyAsync();
  });
  $scope.recompileData();

  $scope.$watch('feature', function(newValue, oldValue) {
    $scope.recompileData();
  });



  $scope.highlight = function(browserId, version){
    var stat = $scope.feature.getBrowserStat(browserId, version);
    $scope.hoveredStat = stat;
    $scope.hoveredUsage = caniuse.getBrowser(browserId).getUsage(version);
  };

  $scope.unhighlight = function(){
    $scope.hoveredStat = null;
    $scope.hoveredUsage = null;
  };

  $scope.hoveredNote = function(idx){
    if($scope.hoveredStat && $scope.hoveredStat.notes){
      return _.find($scope.hoveredStat.notes, function(noteIdx){
        return idx == noteIdx;
      });
    }
  };


  $scope.getStatus = function(browserId){
    if($scope.feature){
      return $scope.feature.getBrowserStat(browserId);
    }
    return null;
  };

  $scope.currentOffset = function(key){

    var res = [];

    if($scope.feature){
      var stats = $scope.feature.data.stats;
      var offset = 0;
      var keyOffset = 0;

      _.map(stats, function(stat, browserId){
        var thisOffset = 0;
        var browser = caniuse.getBrowser(browserId);

        _.each(browser.getActiveVersions(), function(version){
          if(version.era < 0){
            thisOffset++;
          }
        });

        if(thisOffset > offset){
          offset = thisOffset;
        }

        if(browserId === key){
          keyOffset = thisOffset;
        }

      });

    }
    res = new Array(offset - keyOffset);
    return res;

  };

}]);