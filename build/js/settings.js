// settings.js

var settings = (function(){

  var _defaults = null;
  var _settings = null;

  var defaultBrowserSettings = function(){
    var obj = {
      active : true,
      explicitVersions : []
    };
    return obj;
  };

  var getDefaults = function(){

    var activeBrowsers = [
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

    var defs = {
      browsers : {
        global : defaultBrowserSettings(),
        browsers : {}
      },
      local : false
    };

    _.each(activeBrowsers, function(browser){
      defs.browsers.browsers[browser] = defaultBrowserSettings();
    });

    return defs;

  };
  _defaults = getDefaults();


  var usableDef = $.Deferred();

  var public_methods = {

    usable : false,
    isOnline : navigator.onLine,

    _defaults : _defaults,

    setCanUse : function(){
      public_methods.usable = true;
      usableDef.resolve();
    },

    setCanNotUse : function(){
      public_methods.usable = false;
    },

    whenUsable : function(){
      return usableDef;
    },

    get : function(cb){
      var def = $.Deferred();

      if(_settings){
        cb && cb(_settings);
        return def.resolve(_settings);
      }
      chrome.storage.local.get('settings', function(sets){

        console.log("Settings:", sets);

        if(!sets || !sets.settings){
          _settings = _defaults;
        }else{
          _settings = $.extend({}, _defaults, sets.settings);
        }
        cb && cb(_settings);
        def.resolve(_settings);
      });
      return def;
    },

    save : function(){
      var saving = $.extend({}, _settings);
      var def = $.Deferred();
      chrome.storage.local.set({'settings': saving}, function(){
        console.log("saved settings:", saving);
        def.resolve(true);
      });
      return def;
    },

    getBrowserSettings : function(browserId){
      return _settings.browsers.browsers[browserId];
    },

    browserIsActive : function(browserId){
      var browser = public_methods.getBrowserSettings(browserId);
      return browser && browser.active;
    },

    versionIsExplicit : function(browserId, version){
      var browser = public_methods.getBrowserSettings(browserId);
      if(browser){
        return browser.explicitVersions.indexOf(version) > -1;
      }
      return false;
    },

    toggleBrowserState : function(browserId){
      var browser = public_methods.getBrowserSettings(browserId);
      if(!browser){
        _settings.browsers.browsers[browserId] = defaultBrowserSettings();
        return;
      }

      if(browser.active){
        browser.active = false;
      }else{
        browser.active = true;
      }
      public_methods.save();

    },

    toggleVersionState : function(browserId, version){
      var browser = public_methods.getBrowserSettings(browserId);
      if(browser){
        var idx = browser.explicitVersions.indexOf(version);
        if(idx > -1){
          browser.explicitVersions.splice(idx, 1);
        }else{
          browser.explicitVersions.push(version);
        }
        public_methods.save();
      }
    },

    toggleLocal : function(){
      if(_settings.local){
        _settings.local = false;
        public_methods.removeDataLocally();
      }else{
        _settings.local = true;
        public_methods.saveDataLocally();
      }
      public_methods.save();
    },

    shouldSaveData : function(){
      return _settings.local;
    },

    saveDataLocally : function(){

      var def = $.Deferred();

      if(!navigator.onLine){
        console.log("Not saving caniuse data locally. User is not connected to internet.");
        return def.reject("offline");
      }

      var updated = Date.now();
      _settings.lastUpdated = updated;
      chrome.storage.local.set({'caniuse': caniuse.full, 'updated': updated}, function(){
        console.log("saved caniuse data locally!");
        def.resolve(updated);
      });

      return def;
    },

    removeDataLocally : function(){
      chrome.storage.local.remove('caniuse', function(){
        _settings.lastUpdated = false;
        console.log("removed caniuse data locally!");
      });
    },

    lastUpdated : function(){
      return _settings.lastUpdated;
    },

    getData : function(){
      var def = $.Deferred();
      chrome.storage.local.get('caniuse', function(data){
        if(data && data.caniuse){
          def.resolve(data.caniuse);
        }
      });
      return def;
    }

  };

  return public_methods;

})();
