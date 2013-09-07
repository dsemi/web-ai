(function() {
    
    var Element = include('lib.ui.Element');

    define('lib.ui.containers.Container', {
        extend : Element,

        init : function() {
            this.callSuper('div');
            this.addClass('container');
        },
        
        add : function() {
            this.appendChildren.apply(this, arguments);            
        },
        
        remove : function() {
            for(var i = 0; i < arguments.length; i++) {
                 this.removeChild(arguments[i]);
            }
        }
    });
})();   