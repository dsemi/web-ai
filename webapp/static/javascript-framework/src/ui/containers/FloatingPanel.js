(function() {

    var Container = include('lib.ui.containers.Container');

    define('lib.ui.containers.FloatingPanel', {
        extend : Container,

        init : function(draggable) {
            this.callSuper();
            this.addClass('floating_panel');

            this.setPosition(0, 0);

            this.setDraggable(draggable);

            this.setFixed(false);
        },

        addToPosition : function(x, y) {
            var pos = this.getPosition();
            this.setPosition(pos.x + x, pos.y + y);
        },

        appendTo : function(parentElem) {
            Container.prototype.appendTo.call(this, parentElem);

            this._setMouseListeners();
        },

        getDepth : function() {
            return this._depth;
        },

        getPosition : function() {
            return this.position;
        },

        setDepth : function(depth) {
            this._depth = depth;
            this.setStyle('z-index', depth);
        },

        setDraggable : function(draggable) {
            this.isDraggable = draggable;
            if (draggable) {
                this.setStyle('cursor', 'move');
            } else {
                this.removeStyle('cursor');
            }
        },

        setFixed : function(isFixed) {
            this.isFixed = isFixed;

            if (this.isFixed) {
                this.setStyle('position', 'fixed');
            } else {
                this.removeStyle('position');
            }
        },

        setPosition : function(x, y) {
            this.position = {
                x : x,
                y : y
            };

            this.setStyle('top', y + 'px');
            this.setStyle('left', x + 'px');
        },

        _setMouseListeners : function() {
            var self = this;

            self._mouseOrigin = {};
            self._scrollOrigin = {};

            this.addListener('mousedown', function(event) {
                self._isClicked = true;
                self._resetOrigins(event);

                // event.preventDefault();
            });

            this.getParent().addListener('mouseup', function() {
                self._isClicked = false;
            });

            this.getParent().addListener('mousemove', function(mouse) {
                if (self.isDraggable && self._isClicked) {

                    var x = (mouse.clientX - self._mouseOrigin.x);
                    var y = (mouse.clientY - self._mouseOrigin.y);

                    if (!self.isFixed) {
                        x += window.pageXOffset - self._scrollOrigin.x;
                        y += window.pageYOffset - self._scrollOrigin.y;
                    }

                    self._resetOrigins(mouse);

                    self.addToPosition(x, y);
                }
            });
        },

        _resetOrigins : function(mouse) {
            this._mouseOrigin.x = mouse.clientX;
            this._mouseOrigin.y = mouse.clientY;
            this._scrollOrigin.x = window.pageXOffset;
            this._scrollOrigin.y = window.pageYOffset;
        }
    });

})();
