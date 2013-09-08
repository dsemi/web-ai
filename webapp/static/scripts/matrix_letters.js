(function() {
	var chars = [];

	setInterval(function() {
		createChar();
	}, 50);

	setInterval(function() {
		updateChars(10);
	}, 1000 / 30);

	function getRandomChar() {
		return (Math.round(Math.random() * 1));
	}

	function updateChars(delta) {
		var y, ch;

		for (var i = 0; i < chars.length; i++) {
			ch = chars[i].el;
			y = parseInt(ch.style.top.match(/\d*/)[0]);
			y += delta * chars[i].speed;

			if (y > 2000) {
				ch.parentNode.removeChild(ch);
				chars.splice(i--, 1);
			} else {
				ch.style.top = y + 'px';
			}
		}

		chars.forEach(function(ch) {

		});
	}

	function createChar() {
		var ch = document.createElement('div');
		document.body.appendChild(ch);
		
		ch.className = 'matrix_char';
		ch.innerHTML = getRandomChar();

		var x = parseInt(getComputedStyle(document.body).width.match(/\d*/)[0]);
		x = Math.round(Math.random() * x);
		var y = 0;

		ch.style.left = x + 'px';
		ch.style.top = y + 'px';
		
		var speed =  Math.random() + 0.5;
		var size = parseInt(getComputedStyle(ch).fontSize.match(/\d*/)[0]) * speed;
		ch.style.fontSize = size + 'pt';

		chars.push({
			el : ch,
			speed : speed
		});
	}

})();
