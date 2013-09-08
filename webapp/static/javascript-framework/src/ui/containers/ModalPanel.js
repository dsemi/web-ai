(function() {

    var FloatingPanel = include('lib.ui.containers.FloatingPanel');
    var Element = include('lib.ui.Element');

    define('lib.ui.containers.ModalPanel', {
        extend : FloatingPanel,
        
        init : function() {
            this.callSuper();
            this.addClass('modal_panel');
            this.setFixed(true);
            this.setDraggable(false);
            
            this.overlay = new Element('div', {
               className : 'overlay',
            });
            
            // Adds self to the body of the document			
			var body = new Element();
			body.element = document.body;
			body.appendChild(this);
        },
        
        appendTo : function(parentElem) {
            this.overlay.appendTo(parentElem);
            FloatingPanel.prototype.appendTo.call(this, parentElem);
        },
        
        hide : function() {
            FloatingPanel.prototype.hide.call(this);
            this.overlay.hide();
        },
        
        moveToCenter : function() {
            var x = this.getParent().getWidth() / 2 - this.getWidth() / 2;
            var y = window.innerHeight / 2 - this.getHeight() / 2;
            
            this.setPosition(x, y);
        },
        
        removeSelf : function() {
            return this.overlay.removeSelf() && FloatingPanel.prototype.removeSelf.call(this);
        },
        
        show : function() {
            FloatingPanel.prototype.show.call(this);
            this.overlay.show();
            this.moveToCenter();
        }
    });

})();
