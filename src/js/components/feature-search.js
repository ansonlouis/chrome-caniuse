// feature-search.js

app.directive('featureSearch', function(){
  return {
    restrict : 'A',
    link: function($scope, el, attrs){
      var prevVal = null;
      el.keyup(function(){
        var val = el.val().trim();
        if(val !== prevVal){
          prevVal = val;
          $scope.$emit('feature-search', val);
        }
      });
    }
  };
});

app.directive('searchEmitter', ['caniuse', function(caniuse){
  return {
    restrict : 'A',
    link: function($scope, el, attrs){
      $scope.$on('feature-search', function(e, query){
        var results = caniuse.findFeature(query, 5);
        $scope.$broadcast('feature-search-results', results, query);
      });
      $scope.$on('choose-feature', function(e, item){
        $scope.$broadcast('feature-chosen', item);
      });
    }
  };
}]);