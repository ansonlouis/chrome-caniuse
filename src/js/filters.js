// filters.js


app.filter('orderByEra', function(){
  return function(items, browserId){
    var arr = [];

    var browser = background.caniuse.getBrowser(browserId);
    var versions = browser.getActiveVersions();

    _.each(versions, function(version){
      var stat = items[version.version];
      arr.push(stat);
    });

    return arr;
  }
});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
