var app=angular.module("CaniuseOptions",[]),background=chrome.extension.getBackgroundPage();app.value("caniuse",background.caniuse),app.value("settings",background.settings),app.directive("scrollWatchUi",function(){return function(e,t,r){var n=function(e){var t=$(e),r=t.scrollTop();t.removeClass("shadow-top shadow-bottom"),r>0&&t.addClass("shadow-top"),e.scrollHeight-r>e.clientHeight&&t.addClass("shadow-bottom")};t.scroll(function(){n(this)});var a=new MutationObserver(function(e){n(t)});a.observe(t[0],{childList:!0})}}),app.controller("optionsController",["$scope","$http","caniuse","settings",function(e,t,r,n){e.caniuse=r,e.browsers=r&&r.getBrowsers(),e.settings=null,e.activeBrowser=null,e.browserSettings=null,e.mode="settings",e.refreshingLocalData=!1,e.searchResults=null,e.searchTotal=0,e.searchValue="",e.$on("feature-search-results",function(t,r){e.mode="search",e.searchResults=r.results,e.searchTotal=r.total,e.searchValue=r.query,e.$applyAsync()}),e.$on("feature-chosen",function(t,r){e.mode="search",e.searchResults=[r],e.searchTotal=0,e.$applyAsync()}),n.get(function(t){e.settings=n,e.$applyAsync()}),e.modeIs=function(t){return e.mode===t},e.setMode=function(t){e.mode=t},e.isActive=function(t){return e.activeBrowser&&e.activeBrowser.data.id===t},e.makeActive=function(t){e.activeBrowser=t,e.browserSettings=n.getBrowserSettings(t.data.id)},e.toggleVersionState=function(e,t){n.toggleVersionState(e,t)},e.toggleBrowserState=function(e){n.toggleBrowserState(e)},e.toggleLocal=function(){n.toggleLocal()},e.refreshLocalData=function(){if(!e.refreshingLocalData){e.refreshingLocalData=!0;var t=1200,r=performance.now();setTimeout(function(){n.saveDataLocally().done(function(){var n=performance.now()-r;setTimeout(function(){e.refreshingLocalData=!1,e.$applyAsync()},t-n)})},100)}},e.noResults=function(){return e.searchValue&&(!e.searchResults||!e.searchResults.length)}}]),app.filter("orderByEra",function(){return function(e,t){var r=[],n=background.caniuse.getBrowser(t),a=n.getActiveVersions();return _.each(a,function(t){var n=e[t.version];r.push(n)}),r}}),app.filter("reverse",function(){return function(e){return e.slice().reverse()}}),app.directive("featureSupport",function(){return{restrict:"E",templateUrl:"templates/feature-support.html",controller:"featureController",scope:{feature:"=featureObj"}}}),app.controller("featureController",["$scope","caniuse","settings",function(e,t,r){e.state=null,e.hoveredStat=null,e.hoveredUsage=null,e.isNumber=angular.isNumber,e.caniuse=t,e.settings=null,e.recompileData=function(){e.stats=e.feature.getGlobalStats()},r.get(function(t){e.settings=r,e.$applyAsync()}),e.recompileData(),e.$watch("feature",function(t,r){e.recompileData()}),e.highlight=function(r,n){var a=e.feature.getBrowserStat(r,n);e.hoveredStat=a,e.hoveredUsage=t.getBrowser(r).getUsage(n)},e.unhighlight=function(){e.hoveredStat=null,e.hoveredUsage=null},e.hoveredNote=function(t){return e.hoveredStat&&e.hoveredStat.notes?_.find(e.hoveredStat.notes,function(e){return t==e}):void 0},e.getStatus=function(t){return e.feature?e.feature.getBrowserStat(t):null},e.currentOffset=function(r){var n=[];if(e.feature){var a=e.feature.data.stats,o=0,s=0;_.map(a,function(e,n){var a=0,c=t.getBrowser(n);_.each(c.getActiveVersions(),function(e){e.era<0&&a++}),a>o&&(o=a),n===r&&(s=a)})}return n=new Array(o-s)}}]),app.directive("featureSearch",function(){return{restrict:"A",link:function(e,t,r){var n=null;t.keyup(_.throttle(function(){var r=t.val().trim();r!==n&&(n=r,e.$emit("feature-search",r))},250))}}}),app.directive("searchEmitter",["caniuse",function(e){return{restrict:"A",link:function(t,r,n){t.$on("feature-search",function(r,n){var a=e.findFeature(n,5);t.$broadcast("feature-search-results",a,n)}),t.$on("choose-feature",function(e,r){t.$broadcast("feature-chosen",r)})}}}]),String.prototype.richText=function(){var e=this.toString();return e=e.replace(/</g,"&lt;").replace(/>/g,"&gt;"),e.replace(/(`(.+?)`)+/gi,function(e,t,r){return"<code>"+r+"</code>"})},app.directive("richText",function(){return{restrict:"A",scope:{value:"@"},link:function(e,t,r){t.html(r.richText.richText()),r.$observe("richText",function(e){t.html(e.richText())})}}}),app.directive("tabLink",function(){return{restrict:"A",scope:{},link:function(e,t,r){t.click(function(e){e.preventDefault(),chrome.tabs.create({url:this.href})})}}});