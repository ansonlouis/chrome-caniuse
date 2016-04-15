// rich-text.js

String.prototype.richText = function(){
  var str = this.toString();
  str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return str.replace(/(`(.+?)`)+/gi, function(match, p1, p2){
      return "<code>" + p2 + "</code>";
  });
};

app.directive('richText', function() {
  return {
    restrict: 'A',
    scope: {
      value: '@'
    },
    link: function(scope, elem, attrs){

      elem.html(attrs.richText.richText());

      attrs.$observe('richText', function(text){
         elem.html(text.richText());
      });

    }
  };
});