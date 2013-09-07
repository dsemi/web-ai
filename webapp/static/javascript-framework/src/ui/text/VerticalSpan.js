(function() {
    
    var Element = include('lib.ui.Element');
    
    define('lib.ui.text.VerticalSpan', {
        extend : Element, 
        
        init : function(text, height) {
            this.callSuper('div', {
                className : 'VerticalSpan'
            });
            
            this._innerSpan = new Element('span', {
                innerHTML : text
            });
            
            this.setHeight(height ? height : '300px');
            
            this.appendChild(this._innerSpan);
        },
        
        setText : function(text) {
            this._innerSpan.element.innerHTML = text;
        },
        
        setHeight : function(height) {
            this._innerSpan.setStyle('width', height);
        }
    });
    
})();
