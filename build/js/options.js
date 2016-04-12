// popup.js

var app = angular.module("CaniuseOptions", []);
var background = chrome.extension.getBackgroundPage();

app.value('caniuse', background.caniuse);
app.value('settings', background.settings);


app.directive('scrollWatchUi', function(){
  return function(scope, element, attrs){

    var makeShadows = function(el){
      var $this = $(el);
      var st = $this.scrollTop();
      $this.removeClass('shadow-top shadow-bottom');

      if(st > 0){
        $this.addClass('shadow-top');
      }
      if(el.scrollHeight - st > el.clientHeight){
        $this.addClass('shadow-bottom');
      }
    };

    element.scroll(function(){
      makeShadows(this);
    });

    // create an observer instance
    var observer = new MutationObserver(function(mutations){
      makeShadows(element);
      console.log("mutations");
    });

    // pass in the target node, as well as the observer options
    observer.observe(element[0], {
      childList: true
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
  $scope.refreshingLocalData = false;
  $scope.searchResults = null;

  $scope.$on('feature-search-results', function(e, results){
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

  $scope.refreshLocalData = function(){
    $scope.refreshingLocalData = true;

    var minTime = 1200; // rotate icon for two seconds minimum, even though request will probably take ~300ms
    var start = performance.now();

    setTimeout(function(){
      settings.saveDataLocally()
        .done(function(){
          var dur = performance.now() - start;
          console.log("running for:", minTime - dur);
          setTimeout(function(){
            console.log("done");
            $scope.refreshingLocalData = false;
            $scope.$applyAsync();
          }, minTime - dur);
        });
    }, 100);

  };

  console.log("here:", $scope.browsers);


}]);
