(function() {
    var Container = include('lib.ui.containers.Container');
    var Element = include('lib.ui.Element');

    define('lib.ui.inputs.Input', {
        extend : Container,

        init : function(attributes) {
            this.callSuper();
            this.addClass('Input');
            this.type = attributes.type;
            
            var label = attributes.label;
            delete attributes.label;

            if (attributes.type === 'select') {
                this._createSelect(attributes);
            } else {
                this._input = new Element('input', attributes);
                this.add(this._input);
            }

            if (this._input.getAttribute('id') === null) {
                this._input.setAttribute('id', 'input_' + this.static.id++);
            }

            if (label) {
                this.setLabel(label);
            }
        },

        _createSelect : function(attributes) {
            var options = attributes.options;
            var selected = attributes.selected;
            delete attributes.type;
            delete attributes.options;
            delete attributes.selected;

            this._input = new Element('select', attributes);

            this.add(this._input);

            // Append the options
            var option;
            for (var i = 0; i < options.length; i++) {
                option = new Element('option');
                option.element.innerHTML = options[i];

                (i === selected) ? option.setAttribute('selected') : null;

                this._input.appendChild(option);
            }
        },

        getLabel : function() {
            return this._label;
        },

        getName : function() {
            return this._input.getAttribute('name');
        },

        getValue : function() {
            var value;

            if (this._input.getAttribute('type') === 'checkbox') {
                value = this._input.element.checked;
            } else {
                value = this._input.element.value;
            }

            return value;
        },

        hasLabel : function() {
            return this._label !== undefined;
        },

        setLabel : function(text) {
            this._label = new Element('label', {
                innerHTML : text,
                'for' : this._input.getAttribute('id'),
            });

            this.add(this._label);
        },

        setValue : function(value) {
            var type = this.type;

            if (type === 'checkbox') {
                this._input.element.checked = value;
            } else if (type === 'select') {
                this._input.element.selectedIndex = value;
            } else {
                this._input.element.value = value;
            }
        },

        static : {
            id : 0
        }
    });
})();
