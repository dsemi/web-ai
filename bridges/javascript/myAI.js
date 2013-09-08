process.on('message', function(state, storage) {
	process.send({
		turn : {
			move : getRandom(state.board)
		},
		
		storage : storage
	});
});

function getValid(board) {
	var valid = [];
	var length = board.length;
	
	for (var i = 0; i < length; i++ ) {
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