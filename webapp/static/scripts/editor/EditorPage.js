(function() {
	var Element = include('lib.ui.Element');
	var Container = include('lib.ui.containers.Container');
	var Input = include('lib.ui.inputs.Input');

	var Ajax = include('lib.utils.Ajax');

	var Ace = include('lib.ui.external.ace.AceEditor');

	define('ai.editor.EditorPage', {
		extend : Container,

		init : function() {
			this.callSuper();

			var params = App.getParams();
			var srcCode = sessionStorage.getItem('src_code');

			var gameTitle = new Element('h1', {
				innerHTML : decodeURIComponent(params.game) + ' AI'
			});

			var header = new Element('h2', {
				innerHTML : 'Code Editor'
			});

			var self = this;
			var email = this.email = new Element('form', {
				action : 'javascript:void(0);',
				innerHTML : '<label>Email: <input type="email" name="email"></label>',
				onsubmit : function() {
					self.submit();
				}
			});

			var ace = this.ace = new Ace(params.lang.toLowerCase(), function() {
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
					url : '/submit_code/',
					contentType : 'application/json',
					
					onSucces : function() {
						alert('Successfully uploaded the code!');
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
