(function() {
    var Container = include('lib.ui.containers.Container');
    var Ace = include('lib.ui.external.AceEditor');
    
    define('synpro.AceView', {
        extend : Container,
        
        init : function() {
            this.callSuper();
            
            this.add(new Ace());
        }
    });
})();
