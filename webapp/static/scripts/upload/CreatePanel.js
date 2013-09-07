(function() {
	var Element = include('lib.ui.Element');
	var ModalPanel = include('lib.ui.containers.ModalPanel');
	
	define('ai.upload.CreatePanel', {
		extend : ModalPanel,
		
		init : function() {
			this.callSuper();
			
			var createNew = this.createNew = document.getElementById('createNew');
			this.element.appendChild(createNew);
			
			var self = this;
			var closeButton = new Element('button', {
				innerHTML : 'Close', 
				onclick : function() {
					self.hide();
				}
			});
			
			this.add(closeButton);
			this.hide();
		},
		
		show : function() {
			this.createNew.show();
			ModalPanel.prototype.show.call(this);
		}
	});
	
})();
