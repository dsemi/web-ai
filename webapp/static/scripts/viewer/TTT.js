(function() {
	var Game = include('ai.viewer.ttt.Game');

	define('ai.viewer.TTT', {
		init : function(data) {
			this.replayData = data;
			this.curStep = 0;

			var game = this.game = new Game();

			var rp_screen = document.getElementById('replay_screen');
			rp_screen.appendChild(game.board.element);
		},

		step : function() {
			var states = this.replayData.states;

			if (this.curStep < states.length) {
				// Read the move and draw to the screen
				this.game.update(this.currentPlayer, states[this.curStep++]);
				this.switchTurns();
			}
		}
	});

})();
