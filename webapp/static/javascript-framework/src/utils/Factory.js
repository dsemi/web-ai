/**
 * A simple implementation of a generic factory.
 * @author Kenny Ruddick
 * Copyright (c) 2013 (MIT License)
 */


(function() {
    define('lib.utils.Factory', {
        init : function(componentType, parameters) {
            this._componentType = componentType;
            this._parameters = parameters;
        },
        
        generate : function() {
            return new this._componentType.apply(this._parameters);
        },
        
        setParameters : function() {
            this._parameters = arguments;
        }
    });
})();
