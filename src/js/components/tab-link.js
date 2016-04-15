// tab-link.js

app.directive('tabLink', function() {
  return {
    restrict: 'A',
    scope: {

    },
    link: function(scope, elem, attrs){

      elem.click(function(e){
        e.preventDefault();
        chrome.tabs.create({ url: this.href });
      });

    }
  };
});