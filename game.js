// Create the canvas
var canvas = document.createElement("canvas");
canvas.id = "canvas";
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
	bgReady = true;
};
bgImage.src = "background.png";

// Hero
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
	heroReady = true;
}
heroImage.src = "hero.png";

// Monster
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function() {
	monsterReady = true;
}
monsterImage.src = "monster.png";

// Game objects
var hero = {
	speed: 256, // pixels per second
	x: 0,
	y: 0,
};
var monster = {
	x: 0,
	y: 0
}
var monstersCaught = 0.0;

// Hand keyboard controls
var keysDown = {};

addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
	delete keysDown[e.keyCode];
}, false);

// Reset when monster caught
var reset = function() {
	//hero.x = canvas.width / 2;
	//hero.y = canvas.height /2;
	
	time = 0;
	
	// Monster somewhere random
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Timer
time = 0.0;
var incrementTime = function() {
	time = time + 1;
}

// Total time
totalTime = 0;
var incrementTotalTime = function() {
	totalTime = totalTime + 1;
}

// Update game objects
var update = function(modifier) {
	if (totalTime >= 60) {
		endGame();
	}
	if (38 in keysDown) { // up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // right
		hero.x += hero.speed * modifier;
	}
	
	// Teleport
	if (hero.x >= 512) {
		hero.x = 6;
	}
	if (hero.y >= 480) {
		hero.y = 6;
	}
	
	if (hero.x <= 5) {
		hero.x = 511;
	}
	if (hero.y <= 5) {
		hero.y = 479;
	}
	
	// Touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		if (time > 0) {
			monstersCaught = monstersCaught + (1 / time);
		}
		else {
			++monstersCaught;
		}
		reset();
		
	}
};

// Draw everything
var render = function() {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
	
	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}
	
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + parseInt(monstersCaught) + " Time: " + totalTime, 32, 32);
};

var main = function() {
	var now = Date.now();
	var delta = now - then;
	
	update(delta / 1000);
	render();
	
	then = now;
	
	requestAnimationFrame(main);
};

var endGame = function() {
	alert("Game over!");
	main.stop();
}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
hero.x = 256;
hero.y = 240;
var start = function() {
	var element = document.getElementById("beginButton");
	element.parentElement.removeChild(element);
	reset();
	window.setInterval(incrementTotalTime, 1000);
	window.setInterval(incrementTime, 1000);
	main();
};

//reset();
//main();