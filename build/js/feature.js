// feature.js

var CaniuseFeature = function(data, caniuse){

  var _this = this;

  var whitelist = [
    "id",
    "description",
    "notes_by_num",
    "spec",
    "stats",
    "title"
  ];

  this.data = null;
  this.caniuse = null;



  this.isMatch = function(q){
    return this.data.description.search(q) > -1 || this.data.title.search(q) > -1;
  };

  this.getBrowserStat = function(browserId, version){
    var browser = this.data.stats[browserId];
    if(version){
      return browser[version];
    }
    return browser;
  };

  this.getSupportedBrowsers = function(){
    return _.mapObject(this.full.stats, function(browser){
      return _.pick(browser, function(version){
        var flag = version[0];
        return flag === "y" || flag === "a";
      });
    });
  };

  this.getNotes = function(){
    return this.data.notes_by_num;
  };

  this.getGlobalStats = function(){
    var supported = this.getSupportedBrowsers();
    var globalStats = {
      full : 0.0,
      partial : 0.0,
      total : 0.0
    };

    _.each(supported, function(versions, browserId){
      _.each(versions, function(support, version){
        var stats = _this.caniuse.getUsage(browserId, version);

        globalStats.total += stats;


        if(support.indexOf('y') > -1){
          globalStats.full += stats;
        }
        if(support.indexOf('a') > -1){
          globalStats.partial += stats;
        }

      });
    });

    for(var key in globalStats){
      globalStats[key] = parseFloat(globalStats[key].toFixed(2));
    }

    return globalStats;
  };

  this.parseSupport = function(flag, version){
    var split = flag.split(' ');
    var support = split.unshift();

    var obj = {
      version : version,
    };

    for(var i=0; i<split.length; i++){
      var c = split[i];

      switch(c){
        // is supported
        case 'y' :
          obj.supported = true;
          break;

        // is not supported
        case 'n' :
          obj.supported = false;
          break;

        // partially supported
        case 'a' :
          obj.supported = true;
          obj.partial = true;
          break;

        // supported with prefix
        case 'x' :
          obj.prefix = true;
          break;

        // unknown character
        default :
          if(c[0] === "#"){
            obj.notes = obj.notes || [];
            obj.notes.push(c.match(/\d+/)[0]);
            break;
          }else{
            obj.supported = false;
            obj.unknown = true;
            break;
          }
      }
    }

    return obj;

  };



  this.init = function(data, caniuse){

    this.caniuse = caniuse;
    this.full = data;
    this.data = _.pick(data, whitelist);

    this.data.stats = _.mapObject(this.data.stats, function(browserStat, key){

      var browser = _this.caniuse.getBrowser(key);

      // var goodStats = _.pick(browserStat, function(stat, versionKey){
      //   return _.find(browser.getVersions(true), function(version){
      //     return version.version == versionKey;
      //   });
      // });

      browserStat = _.mapObject(browserStat, _this.parseSupport);

      return browserStat;

    });

    this.index = {
      id : this.data.id,
      title : this.data.title,
      description : this.data.description
    };

    return data;

  };

  this.init(data, caniuse);

};

