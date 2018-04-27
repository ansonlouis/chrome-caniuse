app.directive('autoFocus',function($timeout){
  return {
    restrict : 'A',
    link : function($scope,$element,$attr){
      $timeout(function(){
        $element.focus();
      });
    }
  }
});