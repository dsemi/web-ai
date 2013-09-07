process.on('message', function(state) {
	process.send({
		move : getRandom(state.board) || 0
	});
});

function getValid(board) {
	var valid = [], i = 0;
	board.forEach(function(space) {
		if (space === 0) {
			valid.push(i);
		}
		
		i++;
	});
	
	return valid;
}

function getRandom(board) {
	var valid = getValid(board);
	
	return valid[Math.floor(Math.random() * board.length)];
}