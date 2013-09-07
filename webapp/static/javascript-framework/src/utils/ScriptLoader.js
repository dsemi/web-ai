(function() {
    define('lib.utils.ScriptLoader', {
       
       init : function(onload) {
           this.onload = onload;
       },
       
       load : function(src) {
           var script = document.createElement('script');
           script.onload = this.onload;
           script.setAttribute('src', src);
           document.body.appendChild(script);
       }
    });
    
})();
