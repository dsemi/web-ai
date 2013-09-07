define('lib.ui.Element', {
    init : function(type, attributes) {
        this.element = document.createElement(type);

        this._children = [];
        this._customListeners = {};

        this.setAttributes(attributes);
    },

    addClass : function(className) {
        className = ' ' + className + ' ';

        if (this.element.className.search(className) === -1) {
            this.element.className += className;
        }
    },

    addListener : function(type, listener, useCapture) {
        // Add DOM event
        if (this.element['on' + type] !== undefined || type === 'mousewheel') {
            this._addDOMListener(type, listener, useCapture);
        }
        // Add custom event
        else {
            this._addCustomListener(type, listener, useCapture);
        }
    },

    _addDOMListener : function(type, listener, useCapture) {
        // Uses the compatible function to add a listener.
        var addListener = 'addEventListener';
        if (this.element[addListener] === undefined) {
            addListener = 'attachEvent';
            type = 'on' + type;
        }

        // Events with compatibility issues
        if (type === 'mousewheel' || type === 'onmousewheel') {
            // Firefox
            this.element[addListener]('DOMMouseScroll', listener, useCapture);
            // Others
            this.element[addListener]('wheel', listener, useCapture);
        }

        this.element[addListener](type, listener, useCapture);
    },

    _addCustomListener : function(type, listener, useCapture) {
        // Creates an empty array of listeners for this event type if it does not already exist.
        if (this._customListeners[type] === undefined) {
            this._customListeners[type] = [];

            // Function for activating the event listener
            this['on' + type] = function(e) {
                for (var i = 0; i < this._customListeners[type].length; i++) {
                    this._customListeners[type][i](e);
                }
            };
            
            // Creates the drag2 listener type 
            if (type === 'drag2') {
            	this._createDragEvent();
            }
        }

        // Adds the custom listener if it does not already exist.
        var i = 0;
        var listenerDoesNotExist;

        do {
            listenerDoesNotExist = (listener !== this._customListeners[type][i]);
            i++;
        } while(listenerDoesNotExist && i < this._customListeners[type].length);

        if (listenerDoesNotExist) {
            this._customListeners[type].push(listener);
        }
    },
    
    _createDragEvent : function() {
        var self = this;
        this.addListener('mousedown', function(e) {
            self.isBeingDragged = true;
            self._dragStart = {
                x : e.clientX,
                y : e.clientY
            };
        });

        this.addListener('mousemove', function(e) {
            if (self.isBeingDragged && self.ondrag2) {
                e.startX = self._dragStart.x;
                e.startY = self._dragStart.y;
                e.endX = e.clientX;
                e.endY = e.clientY;

                self._dragStart = {
                    x : e.endX,
                    y : e.endY
                };

                self.ondrag2(e);
            }
        });

        App.addListener('mouseup', function() {
            self.isBeingDragged = false;
        });
    },

    appendTo : function(parentElem) {
        parentElem.element.appendChild(this.element);
        return parentElem;
    },

    appendChild : function(childElem) {
        if ( typeof childElem === 'string') {
            childElem = new lib.ui.Element(childElem);
        }

        childElem._parent = this;
        this._children.push(childElem);

        childElem.appendTo(this);

        return childElem;
    },

    appendChildren : function(elements) {
        var children = elements instanceof Array ? elements : arguments;
        for (var i = 0; i < children.length; i++) {
            this.appendChild(children[i]);
        }

        return this;
    },

    getAttribute : function(attrName) {
        return this.element.getAttribute(attrName);
    },

    getChild : function(id) {
        return this.element.getElementById(id);
    },

    getChildren : function() {
        return this._children;
    },

    getHeight : function() {
        return parseFloat(this.getStyle('height').replace('px', ''));
    },

    getParent : function() {
        return this._parent;
    },

    getStyle : function(property) {
        return getComputedStyle(this.element)[property];
    },

    getWidth : function() {
        return parseFloat(this.getStyle('width').replace('px', ''));
    },

    hide : function() {
        this.isHidden = true;
        this.setStyle('display', 'none');
        this._propagateHideEvent();
    },

    _propagateHideEvent : function() {
        if (this.onhide) {
            this.onhide();
        }

        var children = this.getChildren();
        var length = children.length;

        for (var i = 0; i < length; i++) {
            children[i]._propagateHideEvent();
        }
    },

    insertBefore : function(childElem, reference) {
        childElem._parent = this;
        this._children.push(childElem);

        this.element.insertBefore(childElem.element, reference.element);

        return childElem;
    },

    removeSelf : function() {
        var parent = this.getParent();
        var success = false;
        
        var i = 0, length = parent._children.length;

        while (!success && i < length) {
            if (parent._children[i] === this) {
                parent._children.splice(i, 1);
                parent.element.removeChild(this.element);
                success = true;
            }

            i++;
        }

        return success;
    },

    removeChild : function(child) {
        child.removeSelf();
    },

    removeChildren : function() {
    	var length = this._children.length;
    	
        while (length > 0) {
            this._children[0].removeSelf();
        }
    },

    removeClass : function(className) {
        this.element.className = this.element.className.replace(className + ' ', '');
    },

    removeListener : function(type, listener, useCapture) {

        // Remove DOM Listener
        if (this.element['on' + type] !== undefined || type === 'mousewheel') {
            this._removeDOMListener(type, listener, useCapture);
        }
        // Remove custom listener
        else {
            this._removeCustomListener(type, listener, useCapture);
        }
    },

    _removeDOMListener : function(type, listener, useCapture) {
        // Uses compatible remove listener function.
        var removeListener = 'removeEventListener';
        if (this.element[removeListener] === undefined) {
            removeListener = 'detachEvent';
            type = 'on' + type;
        }
        
        // Events with compatibility issues.
        if (type === 'mousewheel' || type === 'onmousewheel') {
            // Firefox
            this.element[removeListener]('DOMMouseScroll', listener, useCapture);
            this.element[removeListener]('wheel', listener, useCapture);
        }
        
        // No compatibility issues.
        this.element[removeListener](type, listener, useCapture);
    },

    _removeCustomListener : function(type, listener, useCapture) {
        if (this._customListeners[type] !== undefined) {
            for (var i = 0; i < this._customListeners[type].length; i++) {
                if (listener === this._customListeners[type][i]) {
                    this._customListeners[type].splice(i, 1);
                    break;
                }
            }
        }
    },

    removeStyle : function(property) {
        var style = this.getAttribute('style');

        style = style ? style : '';
        style = style.replace(new RegExp('(' + property + '):{1}[^;]*;'), '');

        this.setAttribute('style', style);
    },

    setAttribute : function(name, value) {
        this.element.setAttribute(name, value);
    },

    setAttributes : function(attributes) {
        var value;

        for (var attr in attributes) {
            value = attributes[attr];

            if (attr === 'innerHTML' || attr === 'innerText' || attr.search('on') === 0 || attr === 'className') {
                this.element[attr] = value;
            } else if (attr === 'listeners') {
                var callback;
                for (var eventType in value) {
                    callback = value[eventType];
                    this.addListener(eventType, callback);
                }
            } else {
                this.element.setAttribute(attr, value);
            }
        }
    },

    setClass : function(className) {
        this.element.className = className + ' ';
    },

    setStyle : function(property, value) {
        var style = this.getAttribute('style');

        style = style ? style : '';
        style = style.replace(new RegExp('(' + property + '):{1}[^;]*;'), '').concat(property, ':', value, ';');

        this.setAttribute('style', style);
    },

    show : function() {
        this.isHidden = false;
        this.removeStyle('display');
        this._propagateShowEvent();
    },

    _propagateShowEvent : function() {
        if (this.onshow && !this.isHidden) {
            this.onshow();
        }

        var children = this.getChildren();
        var length = children.length;

        for (var i = 0; i < length; i++) {
            children[i]._propagateShowEvent();
        }
    }
});
