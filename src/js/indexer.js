// indexer.js

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
};



function indexer(config){

  var index = {};

  this.obj = config.obj;
  this.fields = [];
  this.exclude = config.exclude || [];
  this.valueParsers = {};
  this.MAX_LEVELS = config.maxLevels !== undefined ? config.maxLevels : Number.MAX_SAFE_INTEGER;


  this.isExcluded = function(key){
    return this.exclude.indexOf(key) > -1;
  };

  this.parseFields = function(fs){
    for(var i=0; i<fs.length; i++){
      var f = fs[i];
      if(typeof(f) === "object"){
        for(var key in f){
          this.valueParsers[key] = f[key];
          this.fields.push(key);
        }
      }
      else{
        this.fields.push(f);
      }
    }
  };

  this.getParsedValue = function(key, value){
    var transform = this.valueParsers[key];
    if(transform){
      if(typeof(transform) === "function"){
        var t = transform(value);
        return t;
      }
    }
    return value;
  };

  this.createIndex = function(obj, masterKey, level){

    _.each(obj, function(v, k){
      var thisLevel = level;
      if(!this.isExcluded(k)){
        if(this.keyInFields(k)){
          var parsedValue = this.getParsedValue(k, v);
          if(!index[parsedValue]){
            index[parsedValue] = [];
          }
          var id = k;
          if(masterKey !== undefined){
            id = masterKey;
          }
          index[parsedValue].push(id);
        }
        else if(--thisLevel >= 0 && (typeof(v) === "object" || v instanceof Array)){
          this.createIndex(v, k, thisLevel);
        }
      }
    }, this);
  };

  this.keyInFields = function(key){
    return this.fields.indexOf(key) > -1;
  };

  this.search = function(query){

    var split = query.split(/\s/g);
    var results = [];
    var found = false;

    for(var i=0; i<split.length; i++){
      var chunk = split[i];
      var rx = new RegExp('^'+chunk, 'gi');
      var res = [];

      for(var key in index){
        if(rx.test(key)){
          console.log("found match:", rx, key);
          res = res.concat(index[key]);
        }
      }
      if(!results.length){
        results = res;
      }else{
        results = res.filter(function(n){
            return results.indexOf(n) > -1;
        });
      }
    }
    return results.getUnique();
  };


  this.parseFields(config.fields);
  this.createIndex(this.obj, null, this.MAX_LEVELS);
  console.log("idx:", index);
}