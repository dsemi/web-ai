var cp = require('child_process');

var stdout = process.stdout;
var stdin = process.stdin;

var child, childRunning, childFinished;

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
		
		child.on('message', function(data) {
			stdout.write(JSON.stringify(data) + '\n');
			childFinished = true;
		});
		
		childRunning = true;
		childFinished = false;
		
		child.send(data);
	}
});

function createChild() {
	child = cp.fork(__dirname + '/myAI.js');
	childRunning = false;
	childFinished = true;
}