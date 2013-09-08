(function() {
	var Game = include('ai.viewer.ttt.Game');

	define('ai.viewer.TTT', {
		init : function(data) {
			this.replayData = data;
			this.curStep = 0;

			this.currentPlayer = 'X';
			this.nextPlayer = 'O';

			var game = this.game = new Game();

			var rp_screen = document.getElementById('replay_screen');
			rp_screen.appendChild(game.board.element);
		},

		step : function() {
			var moves = this.replayData.moves;

			if (this.curStep < moves.length) {
				// Read the move and draw to the screen
				this.game.update(this.currentPlayer, moves[this.curStep++]);
				this.switchTurns();
			}

			// this.game.updateMove(this.currentPlayer, this.curStep++);
			// this.switchTurns();
		},

		switchTurns : function() {
			var cur = this.currentPlayer;
			this.currentPlayer = this.nextPlayer;
			this.nextPlayer = cur;
		}
	});

})();
