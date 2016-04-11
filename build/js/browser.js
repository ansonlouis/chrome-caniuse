var CaniuseBrowser = function(data, caniuse){

  var _this = this;
  var whitelist = [
    "id",
    "browser",
    "type",
    "version_list",
    "current_version"
  ];

  this.data = null;
  this.caniuse = null;

  this.getVersions = function(full){
    if(full){
      return this.full.version_list;
    }
    return this.data.version_list;
  };

  this.getActiveVersions = function(){
    var versions = this.getVersions(true);
    return _.filter(versions, function(version){
      return this.versionIsGreen(version) || settings.versionIsExplicit(this.data.id, version.version);
    }, this);
  };

  this.isCurrentVersion = function(version){
    return this.data.current_version === version;
  };
  this.isFuture = function(version){
    var version = this.getVersion(version);
    return version.era > 0;
  };

  this.getVersion = function(version){
    return _.find(this.full.version_list, function(item){
      return item.version == version;
    });
  };

  this.versionIsGreen = function(version){
    if(typeof(version) !== "object"){
      version = this.getVersion(version);
    }
    return version.era >= -2 && version.era <= 2;
  };

  this.getFullUsage = function(){
    var usage = _.reduce(this.full.version_list, function(memo, version){
      return memo + version.global_usage;
    }, 0);
    return parseFloat(usage.toFixed(2));
  };

  this.getUsage = function(version){
    var version = this.getVersion(version);
    return version && version.global_usage;
  };

  this.getEra = function(version){
    var version = getVersion(version);
    return version && version.era;
  };

  this.getSupport = function(featureId, version){
    var feature = this.caniuse.getFeature(featureId);
    var stat = feature.getBrowserStat(this.data.id);
  };

  this.getVersionsBeforeCurrent = function(){
    var versions = this.getVersions(true);
    var arr = [];
    _.find(versions, function(version){
      if(version.era < 0){
        arr.push(version);
        return false;
      }
      return true;
    });
    return arr;
  };

  this.getVersionsAfterCurrent = function(){
    var versions = this.getVersions(true);
    var arr = [];
    _.each(versions, function(version){
      if(version.era > 0){
        arr.push(version);
        return false;
      }
      return true;
    });
    return arr;
  };

  this.getVersionUsage = function(version){
    var version = this.getVersion(version);
    return version.global_usage;
  };

  this.init = function(data, caniuse){

    this.full = data;
    this.caniuse = caniuse;
    this.data = _.pick(data, whitelist);

    // this.data.version_list = _.filter(this.data.version_list, function(version){
    //   var era = parseInt(version.era, 10);
    //   if(era >= -2 && era <= 2){
    //     return true;
    //   }
    //   return false;
    // });

    return this.data;

  };

  this.init(data, caniuse);

};
