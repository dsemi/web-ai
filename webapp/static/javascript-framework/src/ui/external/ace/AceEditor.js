(function() {

	var Container = include('lib.ui.containers.Container');
	var ScriptLoader = include('lib.utils.ScriptLoader');

	define('lib.ui.external.ace.AceEditor', {
		extend : Container,

		init : function(mode, callback) {
			this.callSuper();
			this.addClass('AceEditor');
			this.setAttribute('id', 'editor_' + (this.static.id++));

			var self = this;
			var loader = new ScriptLoader();

			loader.onload = function() {
				var editor = self.editor = ace.edit(self.getAttribute('id'));
				editor.getSession().setMode( mode ? 'ace/mode/' + mode : 'ace/mode/javascript');
				
				callback();
			};

			loader.load(lib.getHome() + 'ui/external/ace/src-min-noconflict/ace.js');
		},

		static : {
			id : 0
		},
		
		getEditor : function() {
			return this.editor;
		}
	});

})();
