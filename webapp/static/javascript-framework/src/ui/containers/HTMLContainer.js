(function() {

    var Container = include('lib.ui.containers.Container');
    var Ajax = include('lib.utils.Ajax');

    define('lib.ui.containers.HTMLContainer', {
        extend : Container,

        init : function(src) {
            this.callSuper();

            var self = this;

            var ajax = new Ajax({
                method : 'GET',
                url : src,
                onSuccess : function(response) {
                    self.element.innerHTML = response;
                }
            });
            
            ajax.send();
        }
    });

})();
