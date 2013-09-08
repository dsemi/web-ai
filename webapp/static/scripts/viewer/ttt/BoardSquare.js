(function() {
    var Container = include('lib.ui.containers.Container');
    var Element = include('lib.ui.Element');

    define('ai.viewer.ttt.BoardSquare', {
        extend : Container,

        init : function() {
            this.callSuper();
            this.addClass('BoardSquare');
        },

        clearImage : function() {
            this.setStyle('background-image', 'none');
        },

        setImage : function(image) {
            this.setStyle('background-image', 'url(' + image.src + ')');
        }
    });
})();
