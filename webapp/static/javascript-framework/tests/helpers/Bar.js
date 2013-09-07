(function() {
    var Foo = include('tests.helpers.Foo');
    
    define('tests.helpers.Bar', {
        extend : Foo,
        
        init : function(string) {
            this.callSuper(string);
        },
        
        upper : function() {
            return this.string.toUpperCase();
        },
        
        lower : function() {
            return this.method().toLowerCase();
        }
    });
})();

