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
			
			var gameTitle = new Element('h1', {
				innerHTML : params.game + ' AI'
			});
			
			var header = new Element('h2', {
				innerHTML : 'Enter in your code below'
			});
			
			var email = this.email = new Element('div', {
				innerHTML : '<label>Email: <input name="email"></label>'
			});
			
			var ace = new Ace(params.lang);
			
			var submit = new Element('button', {
				innerHTML : 'Submit'
			});
			
			this.add(gameTitle, header, ace, email, submit);
		},
		
		checkInput : function() {
			var input = this.email.element.querySelector('input');
			var email = input.value;
			
			return !!value;
		}
	});
	
})();
