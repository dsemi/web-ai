var me, other, tie = 3;

process.on('message', function(state, storage) {
	me = state.player;
	other = me === 1 ? 2 : 1;

	process.send({
		turn : {
			move : getSmart(state.board, me)
		},

		storage : storage
	});
});

function getValid(board) {
	var valid = [];
	var length = board.length;

	for (var i = 0; i < length; i++) {
		if (board[i] === 0) {
			valid.push(i);
		}
	}

	return valid;
}

function getRandom(board) {
	var valid = getValid(board);
	var move;

	if (valid.length) {
		move = valid[Math.floor(Math.random() * valid.length)];
	} else {
		move = -1;
	}

	return move;
}

function getSmart(board, player) {
	var valid = getValid(board);

	// Blank board
	if (valid.length === 9) {
		return 0;
	}

	// Attempts all valid moves
	var length = valid.length;
	var move;
	for (var i = 0; i < length; i++) {
		move = valid[i];

		if (canWin(board, move, player)) {
			return move;
		}
	}

	return getRandom(board);
}

function canWin(board, p1) {
	var winnable = false;

	// Attempts all valid moves
	var valid = getValid(board);
	var length = valid.length;
	var move;
	for (var i = 0; i < length; i++) {
		move = valid[i];

		if (canWin(board, move, player)) {
			return true;
		}
	}

	return false;
}

function canWin(board, move, p1) {
	var simBoard = board.slice(0);

	// Makes the move
	simBoard[move] = p1;

	// If game is over then determines if won.
	var winner = getWinner(simBoard);
	if (winner) {
		return winner === p1;
	}

	// Other player goes
	var p2 = (p1 === me) ? other : me;

	var valid = getValid(simBoard);
	var length = valid.length;

	var move, clonedBoard, winnable = false;
	for (var i = 0; i < length; i++) {
		clonedBoard = simBoard.slice(0);
		move = valid[i];
		clonedBoard[move] = p2;

		// If there is a winner this round
		winner = getWinner(clonedBoard);
		if (winner && winner === p1 || winner === tie) {
			return true;
		} else {
			return false;
		}
		// No winner yet
		if (canWin(clonedBoard, p1)) {
			return true;
		}
	}

	return false;
}

function getWinner(board) {
	// Horizontal
	for (var i = 0; i <= 6; i += 3) {
		if (board[i] === board[i + 1] === board[i + 2]) {
			return board[i];
		}
	}

	// Vertical
	for (var i = 0; i <= 2; i++) {
		if (board[i + 3] === board[i + 4] === board[i + 5]) {
			return board[i + 3];
		}
	}

	// Major
	if (board[0] === board[4] === board[8]) {
		return board[0];
	}

	// Minor
	if (board[2] === board[4] === board[6]) {
		return board[2];
	}

	// Board Full - no Winner
	if (getValid(board).length === 0) {
		return 3;
	}

	// No winner
	return 0;
}
