(function() {
    var Element = include('lib.ui.Element');
    var Input = include('lib.ui.inputs.Input');

    /**
     * Wrapper for the DOM form element with utility methods.
     */
    define('lib.ui.inputs.Form', {
        extend : Element,

        /**
         * Constucts a new Form object with the given <i>inputs</i>.  If no inputs are supplied,
         * it will try to look for inputs given in the definition object.  This is useful when
         * extending this class.
         * @param {Object} inputs An array of objects that contain the attributes of the inputs.
         */
        init : function(attributes) {
            this.callSuper('form');
            this.addClass('Form');

            if (attributes !== undefined) {
                var inputs = attributes.inputs;
                delete attributes.inputs;

                this.setAttributes(attributes);

                if (inputs !== undefined) {
                    for (var i = 0; i < inputs.length; i++) {
                        this.addInput(inputs[i]);
                    }
                }
            }

            if (this.getAttribute('action') === null) {
                this.setAttribute('action', 'javascript:void(0);');
            }
        },

        /**
         * Adds an input to this form with the given attributes.
         * @param {Object} attributes An object containing the attributes of the input.
         */
        addInput : function(attributes) {
            var input = new Input(attributes);
            input.isAnInput = true;
            this.appendChild(input);
        },

        get : function(name) {
            var inputs = this.getInputs();

            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].getName() === name) {
                    return inputs[i];
                }
            }
        },

        getValue : function(name) {
            var input = this.get(name);
            return input ? input.getValue() : undefined;
        },

        getData : function() {
            var inputs = this.getInputs();
            var values = {};
            var name;

            for (var i = 0; i < inputs.length; i++) {
                name = inputs[i].getName();

                if (name !== null) {
                    values[name] = inputs[i].getValue();
                }
            }

            return values;
        },

        /**
         * Gets all input elements nested one level below this form.
         * @return	An array containing the inputs. They are wrapped in the <code>Element</code> class.
         */
        getInputs : function() {
            var children = this.getChildren();

            var inputs = [];
            for (var i = 0; i < children.length; i++) {
                if (children[i].isAnInput) {
                    inputs.push(children[i]);
                }
            }

            return inputs;
        },

        setValue : function(name, value) {
            var inputs = this.getInputs();

            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].getName() === name) {
                    inputs[i].setValue(value);
                    break;
                }
            }
        }
    });
})();
