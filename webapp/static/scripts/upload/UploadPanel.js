(function() {
	var ModalPanel = include('lib.ui.containers.ModalPanel');
	var Element = include('lib.ui.Element');
	
	define('ai.upload.UploadPanel', {
		extend : ModalPanel,
		
		init : function() {
			this.callSuper();
			
			var self = this;
			var closeButton = new Element('button', {
				innerHTML : 'X',
				className : 'close',
				onclick : function() {
					self.hide();
				}
			});
			
			var uploadForm = this.uploadForm = document.getElementById('fileUploader');
			this.hide();
			
			this.add(closeButton);
			this.element.appendChild(uploadForm);
			
			this.moveToCenter();
		},
		
		show : function() {
			this.uploadForm.show();
			
			ModalPanel.prototype.show.call(this);
		}
	});
})();
