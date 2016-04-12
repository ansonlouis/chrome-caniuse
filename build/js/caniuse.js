// caniuse.js

var CaniuseData = function(data){

  var _this = this;

  var searchCache = {};

  this.data = null;
  this.browsers = null;
  this.features = null;

  this.notableBrowsers = [
    'ie',
    'edge',
    'firefox',
    'chrome',
    'safari',
    'opera',
    'ios_saf',
    'android',
    'and_chr'
  ];

  this.getFeature = function(featureId){
    return this.features[featureId];
  };

  this.getBrowsers = function(){
    return this.browsers;
  };

  this.getBrowser = function(browserId){
    return this.browsers && this.browsers[browserId];
  };
  this.getBrowserVersion = function(browserId, version){
    var browser = this.getBrowser(browserId);
    if(browser){
      return browser.getVersion(version);
    }
    return false;
  };

  this.isNotableBrowser = function(browserId){
    // this.notableBrowsers.indexOf(browserId) > -1 ||
    return settings.browserIsActive(browserId);
  };

  this.getNotableBrowsers = function(){
    return _.pick(this.browsers, function(browser, browserId){
      return _this.isNotableBrowser(browserId);
    });
  };

  this.isCurrentVersion = function(browserId, version){
    var browser = this.getBrowser(browserId);
    return browser.isCurrentVersion(version);
  };

  this.isFuture = function(browserId, version){
    var browser = this.getBrowser(browserId);
    return browser.isFuture(version);
  };

  this.getUsage = function(browserId, version){
    var browser = this.getBrowser(browserId);
    return browser.getUsage(version);
  };

  this.parseFeatureData = function(features){
    this.features = _.mapObject(features, function(feature, id){
      feature.id = id;
      return new CaniuseFeature(feature, _this);
    });
    return this.features;
  };


  this.parseBrowserData = function(browsers){
    this.browsers = _.mapObject(browsers, function(browser, id){
      browser.id = id;
      return new CaniuseBrowser(browser, _this);
    });
    return this.browsers;
  };


  this.findFeature = function(q, limit){

    limit = limit !== undefined ? limit : Number.MAX_SAFE_INTEGER;

    if(searchCache[q] && searchCache[q].length >= limit){
      return searchCache[q].slice(0, limit);
    }

    var found = [];

    var results = this.index.search(q);

    _.every(results, function(result){
      var feature = _this.features[result];
      found.push(feature);
      if(--limit <= 0){
        return false;
      }
      return true;
    });

    searchCache[q] = found;

    return found;
  };

  this.getSearchableObject = function(){
    return _.map(this.features, function(feature){
      return _.pick(feature, 'index').index;
    });
  };

  this.createIndex = function(){
    var featureData = this.getSearchableObject();
    this.index = new indexer({
      obj : featureData,
      fields : ['title', 'description', 'id']
    });
  };

  this.parse = function(data){

    console.log("parsing:", data);
    this.full = data;
    this.parseBrowserData(data.agents);
    this.parseFeatureData(data.data);

    this.createIndex();

    console.log("parsed:", this);
  };

  this.parse(data);

};