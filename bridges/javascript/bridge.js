var cp = require('child_process');

var stdout = process.stdout;
var stdin = process.stdin;

var child, childRunning, childFinished;

var storage = {};

var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

stdin.resume();
createChild();
rl.on('line', function(line) {
	// Kills lagging process
	if (childRunning && !childFinished) {
		child.kill('SIGKILL');
		createChild();
	}
		
	if (line === 'exit') {
		if (childRunning){
			child.kill('SIGKILL');
		}
		process.abort();
	} 
	else {
		data = JSON.parse(line);
		
		childRunning = true;
		childFinished = false;
		
		child.send(data);
	}
});

function createChild() {
	child = cp.fork(__dirname + '/myAI.js');
	child.on('message', function(data) {
	
		// Saves data between runs
		var store = data.storage;
		if (store) {
			for (var key in store) {
				storage[key] = store[key];
			}
		}
	
		stdout.write(JSON.stringify(data.turn) + '\n');
		childFinished = true;
	});
		
	childRunning = false;
	childFinished = true;
}