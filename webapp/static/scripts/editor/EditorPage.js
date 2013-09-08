(function() {
	var Element = include('lib.ui.Element');
	var Container = include('lib.ui.containers.Container');
	var Input = include('lib.ui.inputs.Input');
	var Ace = include('lib.ui.external.ace.AceEditor');

	var Ajax = include('lib.utils.Ajax');

	var ED_THEME = 'ace/theme/terminal';

	define('ai.editor.EditorPage', {
		extend : Container,

		init : function() {
			this.callSuper();

			var params = App.getParams();
			var srcCode = sessionStorage.getItem('src_code');

			var header = new Element('h1', {
				innerHTML : decodeURIComponent(params.game) + ' AI Editor'
			});

			var self = this;
			var email = this.email = new Element('form', {
				action : 'javascript:void(0);',
				innerHTML : '<label id="email_label">Email: <input type="email" name="email"></label>',
				onsubmit : function() {
					self.submit();
				}
			});

			var ace = this.ace = new Ace(params.lang.toLowerCase(), function() {
				var editor = ace.getEditor();
				editor.setTheme(ED_THEME);

				if (srcCode) {
					editor.setValue(decodeURIComponent(srcCode));
				}
			});

			ace.addClass('editor');

			var submit = new Element('button', {
				innerHTML : 'Submit',
				className : 'button'
			});

			email.appendChild(submit);

			this.add(header, ace, email);
		},

		checkInput : function() {
			var input = this.email.element.querySelector('input');
			var email = input.value;

			return !!email;
		},

		getEmail : function() {
			return this.email.element.querySelector('input').value;
		},

		submit : function() {
			if (this.checkInput()) {
				var params = App.getParams();

				data = {
					email : this.getEmail(),
					lang : params.lang.toLowerCase(),
					game : params.game.toLowerCase(),
					code : encodeURIComponent(this.ace.getEditor().getValue())
				};

				var ajax = new Ajax({
					method : 'POST',
					url : '/submit_code',
					contentType : 'application/json',

					onSuccess : function() {
						alert('Your\'e code has successfully been submitted!  ' 
							+ 'We will email you when the simulation has finished ' 
							+ 'with a link to the simulation.');
							
						location.href = '/';
					},

					onFail : function() {
						alert('Failed to upload');
					}
				});

				ajax.send(JSON.stringify(data));
			}
		}
	});

})();
