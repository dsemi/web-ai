(function() {
	var TiledPanel = include('lib.ui.containers.TiledPanel');

	var BoardSquare = include('ai.viewer.ttt.BoardSquare');

	define('ai.viewer.ttt.GameBoard', {
		extend : TiledPanel,

		init : function() {
			this.callSuper(3);

			for (var i = 0; i < 9; i++) {
				this.add(new BoardSquare());
			}

			this.board = new Array(9);
		},

		clear : function() {
			this.board = new Array(9);

			var boardSquares = this.getTiles();
			for (var i = 0; i < 9; i++) {
				boardSquares[i].clearImage();
			}
		},

		move : function(id, position) {
			this.board[position] = id;
		}
	});

})();
