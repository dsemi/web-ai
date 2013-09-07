define('tests.helpers.Foo', {
    
    init : function(string) {
        this.string = string;
    },
    
    method : function() {
        return this.string;
    },
    
    string : '',
    object : {},
    array : []
});
