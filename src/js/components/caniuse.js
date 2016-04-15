// caniuse.js

app.controller("caniuseController", ['$scope', '$http', 'caniuse', 'settings', function($scope, $http, caniuse, settings){

  console.log("here");
  $scope.result = null;
  $scope.results = null;
  $scope.caniuse = caniuse;
  $scope.settings = null;

  $scope.searchValue = "";
  $scope.resultActive = 0;
  $scope.hoveredStat = null;
  $scope.hoveredUsage = null;

  settings.get(function(sets){
    $scope.settings = settings;
    $scope.$applyAsync();
  });

  $scope.$on('feature-search-results', function(e, results){
    $scope.searchValue = results.query;
    $scope.result = null;
    $scope.resultActive = 0;

    if(results && results.results.length){
      $scope.result = results.results[0];
    }

    $scope.$applyAsync();
  });

  $scope.$on('feature-chosen', function(e, feature){
    $scope.result = feature;
    $scope.resultActive = 0;
    $scope.searchValue = "";
    $scope.$applyAsync();
  });

  $scope.highlight = function(browserId, version){
    var stat = $scope.result.getBrowserStat(browserId, version);
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
    if($scope.result){
      return $scope.result.getBrowserStat(browserId);
    }
    return null;
  };

  $scope.currentOffset = function(key){

    var res = [];

    if($scope.result){
      var stats = $scope.result.data.stats;
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

  $scope.noResults = function(){
    return $scope.searchValue && !$scope.result;
  }

}]);