// popup.js

var app = angular.module("CaniuseApp", []);
var background = chrome.extension.getBackgroundPage();

app.value('caniuse', background.caniuse);
app.value('settings', background.settings);



