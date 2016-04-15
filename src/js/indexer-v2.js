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

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function indexer(config){

  var index = {};

  this.obj = config.obj;
  this.fields = [];
  this.exclude = config.exclude || [];
  this.valueParsers = {};
  this.MAX_LEVELS = config.maxLevels !== undefined ? config.maxLevels : Number.MAX_SAFE_INTEGER;
  this.scores = config.scores || null;


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

  this.createIndex = function(arr, masterKey){

    console.log("indexing:", arr);

    _.each(arr, function(item, idx){
      _.each(item, function(v, k){
        if(!this.isExcluded(k)){
          if(this.keyInFields(k)){
            var parsedValue = this.getParsedValue(k, v);
            var tokens = this.tokenize(parsedValue);

            _.each(tokens, function(token){
              token = token.trim();
              if(token && token.length > 1 && STOP_WORDS.indexOf(token) < 0){
                if(!index[token]){
                  index[token] = {};
                }

                if(!index[token][item.id]){
                  index[token][item.id] = 0;
                }
                if(this.scores && this.scores[k]){
                  index[token][item.id] += this.scores[k];
                }else{
                  index[token][item.id]++;
                }
              }
            }, this);
          }
        }
      }, this);
    }, this);
  };

  this.keyInFields = function(key){
    return this.fields.indexOf(key) > -1;
  };

  this.tokenize = function(str){
    str = str.replace(/[^a-zA-Z0-9'-]+/gi, ' ');
    return str.toLowerCase().split(' ');
  };


  this.getQueryRegex = function(word){
    return new RegExp('^' + word, 'i');
  };


  this.search = function(query){

    var split = query.split(/\s/g);
    var results = [];
    var fullMatches = {};
    var found = false;

    var indexToSearch = index;

    _.each(split, function(word, count){

      word = word.trim();
      if(!word.length){
        return;
      }
      var wordMatches = {};

       _.each(indexToSearch, function(indexItem, indexKey){

        var wordRegex = this.getQueryRegex(word);

        var matched = indexKey.search(wordRegex) > -1;

        if(matched){
          _.each(indexItem, function(score, matchId){

            // if were not on the first search word, dont bother
            // as all words should match
            if(count > 0 && !fullMatches[matchId]){ return; }

            if(!wordMatches[matchId]){
              wordMatches[matchId] = 0;
            }
            wordMatches[matchId] += score;
          }, this);
        }

        return matched;

      }, this);
      // END INDEX LOOP

      var temp = {};
       _.each(wordMatches, function(score, word){
        if(count > 0 && !fullMatches[word]){
          return false;
        }
        temp[word] = wordMatches[word] + (fullMatches[word] || 0);
        return true;
      });
      fullMatches = temp;

    }, this);
    // END QUERY WORD LOOP

    results = Object.keys(fullMatches).sort(function(a,b){
      return fullMatches[b] - fullMatches[a];
    });
    return results;
  };


  this.parseFields(config.fields);
  this.createIndex(this.obj, null, this.MAX_LEVELS);
  console.log("idx:", index);
}