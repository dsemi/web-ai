(function() {
	var Element = include('lib.ui.Element');
	var Container = include('lib.ui.containers.Container');

	var Input = include('lib.ui.inputs.Input');

	var Ace = include('lib.ui.external.ace.AceEditor');

	define('ai.editor.EditorPage', {
		extend : Container,

		init : function() {
			this.callSuper();

			var params = App.getParams();
			var srcCode = sessionStorage.getItem('src_code');

			var gameTitle = new Element('h1', {
				innerHTML : params.game + ' AI'
			});

			var header = new Element('h2', {
				innerHTML : 'Code Editor'
			});

			var self = this;
			var email = this.email = new Element('form', {
				action : 'javascript:void(0);',
				innerHTML : '<label>Email: <input name="email"></label>',
				onsubmit : function() {
					self.submit();
				}
			});

			var ace = new Ace(params.lang.toLowerCase(), function() {
				if (srcCode) {
					ace.getEditor().setValue(decodeURIComponent(srcCode));
				}
			});
			
			var submit = new Element('button', {
				innerHTML : 'Submit'
			});

			email.appendChild(submit);

			this.add(gameTitle, header, ace, email);
		},

		checkInput : function() {
			var input = this.email.element.querySelector('input');
			var email = input.value;

			return !!email;
		},

		submit : function() {
			if (this.checkInput()) {
				alert('submit');
			}
		}
	});

})();
