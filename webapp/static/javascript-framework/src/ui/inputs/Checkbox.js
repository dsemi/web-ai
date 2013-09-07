(function() {

    var Element = include('lib.ui.Element');

    define('lib.ui.inputs.Checkbox', {
        extend : Element,

        init : function(attributes) {
            this.callSuper('div');
            this.addClass('checkBox');
            this.addClass('unselectable');
            this.uncheck();

            var self = this;
            this.addListener('click', function() {
                self.toggle();
            });
            
            this.setAttributes(attributes);
        },

        check : function(check) {
            this.setAttribute('checked', check === undefined ? 'true' : check);
        },

        isChecked : function() {
            return this.getAttribute('checked') === 'true' ? true : false;
        },

        toggle : function() {
            this.check(!this.isChecked());
        },

        uncheck : function() {
            this.setAttribute('unchecked', 'false');
        }
    });

})(); 