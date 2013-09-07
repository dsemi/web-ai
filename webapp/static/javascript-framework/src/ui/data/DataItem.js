(function() {

    var Element = include('lib.ui.Element');

    define('lib.ui.data.DataItem', {
        extend : Element,

        init : function(data) {
            var self = this;
            
            this.callSuper('li', {
                className : 'dataItem'
            });

            var name = new Element('div');
            var value = new Element('div');

            this.appendChildren(name, value);

            if (data !== undefined) {
                this.setData(data);
            }
            
            this.addListener('click', function(event) {
                if (self._listener !== undefined) {
                    self._listener(self);
                }
            });
        },

        getName : function() {
            return this.getChildren()[0].element.innerHTML;
        },

        getValue : function() {
            return this.getChildren()[1].element.innerHTML;
        },

        setData : function(data) {
            if ( typeof data === 'object') {
                this.setName(data.name);
                this.setValue(data.value);
            } else {
                this.setValue(data);
            }
        },

        setName : function(name) {
            this.getChildren()[0].element.innerHTML = name;
        },

        setListener : function(listener) {
            this._listener = listener;
        },

        setValue : function(value) {
            this.getChildren()[1].element.innerHTML = value;
        }
    });

})();
