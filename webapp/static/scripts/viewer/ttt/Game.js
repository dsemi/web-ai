(function() {
	var AssetManager = include('ai.viewer.ttt.AssetManager');
	var GameBoard = include('ai.viewer.ttt.GameBoard');

	define('ai.viewer.ttt.Game', {
		init : function() {
			this.board = new GameBoard();

			var self = this;
			this.manager = new AssetManager();
			this.loadAssets();
		},

		loadAssets : function() {
			var self = this;
			var manager = this.manager;

			manager.load(1, 'image', '/static/images/X.bmp');
			manager.load(2, 'image', '/static/images/O.bmp');
		},

		updateMove : function(id, updatedBoard) {
			var self = this;
			var board = this.board;

			this.reset();

			var id;
			for (var i = 0; i < updatedBoard.length; i++) {
				id = updatedBoard[i];

				if (id !== 0) {
					board.move(id, i);
					board.getTiles()[i].setImage(this.manager.get(id));
				}
			}
		},

		currentPlayerWon : function(position) {
			var board = this.board.board;
			var isWinner = false;
			var symbol = board[position];

			// Horizontal
			var leftBox = Math.floor(position / 3) * 3;
			isWinner = (symbol === board[leftBox]) && (symbol === board[leftBox + 1]) && (symbol === board[leftBox + 2]);

			// Vertical
			if (!isWinner) {
				var topBox = position % 3;
				isWinner = (symbol === board[topBox]) && (symbol === board[topBox + 3]) && (symbol === board[topBox + 6]);
			}

			// Diagonal
			symbol = board[position];
			if (!isWinner && position % 2 === 0) {
				isWinner = (symbol === board[0]) && (symbol === board[4]) && (symbol === board[8]) || (symbol === board[2]) && (symbol === board[4]) && (symbol === board[6]);
			}

			return isWinner;
		},

		endGame : function(tie) {
		},

		reset : function() {
			this.board.clear();
		}
	});
})();
