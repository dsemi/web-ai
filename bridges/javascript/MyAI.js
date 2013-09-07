process.on('message', function(state) {
	process.send({
		move : getRandom(state.board)
	});
});

function getValid(board) {
	var valid = [], i = 0;
	board.foreach(function(space) {
		if (space === 0) {
			valid.push(i);
		}
		
		i++;
	});
}

function getRandom(board) {
	var valid = getValid(board);
	
	return valid[Math.floor(Math.random() * board.length)];
}