// autocomplete.js

app.directive('autoComplete', function() {
  return {
    restrict : 'E',
    templateUrl : 'templates/autocomplete.html',
    controller : 'autocompleteController'
  };
});

app.controller("autocompleteController", ['$scope', '$http', 'caniuse', 'settings', function($scope, $http, caniuse, settings){

  $scope.results = null;
  $scope.resultActive = 0;


  $scope.$on('feature-search-results', function(e, results, value){
    $scope.results = results && results.results;
    $scope.resultActive = 0;
  });

  $scope.navigate = function(e){

    if($scope.results){
      // down
      if(e.which === 40){
        e.stopPropagation();
        e.preventDefault();
        $scope.resultActive++;
        if($scope.resultActive >= $scope.results.length){
          $scope.resultActive = 0;
        }
      }
      // up
      else if(e.which === 38){
        e.stopPropagation();
        e.preventDefault();
        $scope.resultActive--;
        if($scope.resultActive < 0){
          $scope.resultActive = $scope.results.length - 1;
        }
      }
      $scope.chooseResult($scope.resultActive);
    }

  };

  $scope.activate = function(e){
    if(e.which === 13){
      e.stopPropagation();
      e.preventDefault();
      $scope.chooseResult($scope.resultActive, true);
    }
  };

  $scope.chooseResult = function(idx, hide){
    var result = $scope.results[idx];
    if(result){
      $scope.$emit('choose-feature', result);
      if(hide){
        $scope.hideResults();
      }
    }
  };

  $scope.hideResults = function(){
    $scope.resultActive = 0;
    $scope.results = null;
  };

}]);