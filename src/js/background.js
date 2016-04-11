// background.js


"use strict";

var caniuse = null;



var retrieveDataFromSource = function(){
  var def = $.Deferred();
  var dataUrl = "https://raw.githubusercontent.com/Fyrd/caniuse/master/fulldata-json/data-2.0.json";
  $.getJSON(dataUrl)
    .done(function(data){
      console.log("woo:", data);
      def.resolve(data);
    })
    .fail(function(){
      def.reject();
    });
  return def;
};



var retrieveData = function(){

  console.log("online status:", navigator.onLine);

  var def = $.Deferred();

  // if user is online, get data from source to stay updated...if the
  // call fails, we'll revert to checking local storage
  if(navigator.onLine){
    retrieveDataFromSource()
    .done(function(data){
      console.log("retrieved from source");
      def.resolve(data);
    })
    .fail(function(){
      console.log("failed to retrieve data from source...");
      if(settings.shouldSaveData()){
        console.log("getting data from local storage");
        settings.getData().done(def.resolve);
      }else{
        console.log("no data was able to be retrieved");
        def.reject(false);
      }
    });
  }
  // if user is not online, check if they have data stored
  // locally and use that instead
  else if(settings.shouldSaveData()){
    console.log("user is offline, getting data from local storage");
    settings.getData().done(def.resolve);
  }else{
    console.log("user is offline and does not have local storge enabled");
    def.reject("offline and no storage found");
  }

  return def;
}


settings.get().done(function(){
  retrieveData()
    .done(function(data){
      console.log("Data retrieved:", data);
      settings.setCanUse();
      caniuse = new CaniuseData(data);
      if(settings.shouldSaveData()){
        settings.saveDataLocally();
      }
    })
    .fail(function(){
      settings.setCanNotUse();
    });
});


// // make sure settings and browser data is retrieved first
// $.when(settings.get(), retrieveData()).done(function(sets, data){

//   if(data){
//     caniuse = new CaniuseData(data);
//   }else if(sets.shouldSaveData()){
//     sets.getData().done(function(data){
//       caniuse = new CaniuseData(data);
//     });
//   }

//   if(sets.shouldSaveData()){
//     set.saveDataLocally();
//   }

// });



