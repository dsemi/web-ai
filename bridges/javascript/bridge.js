var cp = require('child_process');

var stdout = process.stdout;
var stdin = process.stdin;

var child, childRunning;

stdin.resume();
stdin.on('data', function(chunk) {
	var data = JSON.parse(chunk);
	
	if (childRunning) {
		child.kill('SIGKILL');
		childRunning = false;
	}
	
	child = cp.fork(__dirname + '/myAI.js');
	childRunning = true;
	
	child.on('message', function(data) {
		stdout.write(JSON.stringify(data) + '\n');
	});
	
	child.send(data);
});