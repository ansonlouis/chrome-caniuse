// popup.js

var app = angular.module("CaniuseOptions", []);
var background = chrome.extension.getBackgroundPage();

app.value('caniuse', background.caniuse);
app.value('settings', background.settings);


app.directive('scrollWatchUi', function(){
  return function(scope, element, attrs){
    element.scroll(function(){
      var $this = $(this);
      var st = $this.scrollTop();
      $this.removeClass('shadow-top shadow-bottom');

      if(st > 0){
        $this.addClass('shadow-top');
      }
      if(this.scrollHeight - st > this.clientHeight){
        $this.addClass('shadow-bottom');
      }
    });
  };
});

app.controller("optionsController", ['$scope', '$http', 'caniuse', 'settings', function($scope, $http, caniuse, settings){

  $scope.caniuse = caniuse;
  $scope.browsers = caniuse && caniuse.getBrowsers();
  $scope.settings = null;
  $scope.activeBrowser = null;
  $scope.browserSettings = null;
  $scope.mode = "settings";

  $scope.searchResults = null;

  $scope.$on('feature-search-results', function(e, results){
    console.log("results:", results);
    $scope.mode = "search";
    $scope.searchResults = null;
    $scope.searchResults = results;
    $scope.$applyAsync();
  });

  $scope.$on('feature-chosen', function(e, feature){
    $scope.mode = "search";
    $scope.searchResults = [feature];
    $scope.$applyAsync();
  });

  settings.get(function(sets){
    $scope.settings = settings;
    $scope.$applyAsync();
  });

  $scope.modeIs = function(flag){
    return $scope.mode === flag;
  };
  $scope.setMode = function(flag){
    $scope.mode = flag;
  };

  $scope.isActive = function(id){
    return $scope.activeBrowser && $scope.activeBrowser.data.id === id;
  };

  $scope.makeActive = function(browser){
    $scope.activeBrowser = browser;
    $scope.browserSettings = settings.getBrowserSettings(browser.data.id);
    console.log("b:", browser, $scope.browserSettings);
  };

  $scope.toggleVersionState = function(browserId, version){
    settings.toggleVersionState(browserId, version);
  };

  $scope.toggleBrowserState = function(browserId){
    settings.toggleBrowserState(browserId);
  };

  $scope.toggleLocal = function(){
    settings.toggleLocal();
  };

  console.log("here:", $scope.browsers);


}]);
