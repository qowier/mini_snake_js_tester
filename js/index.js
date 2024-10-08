const gameContainer = document.querySelector('#gameContainer');
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext('2d');
const scoreDisplay = document.querySelector("#scoreDisplay");
const startGameBtn = document.querySelector("#startGameBtn");
const resetBtn = document.querySelector("#resetGameBtn");

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const snakeColour = "lightgreen";
const snakeHeadColour = "green";
const snakeBorder = "darkgreen";
const foodColour = "red";
const foodBorder = "darkred";
const unitSz = 16;

var running = false;
var xVelocity = unitSz;
var yVelocity = 0;
var xFood;
var yFood;
var score = 0;
var snake = [
	{x: gameWidth / 2 + unitSz * 4, y: gameHeight / 2},
	{x: gameWidth / 2 + unitSz * 3, y: gameHeight / 2},
  {x: gameWidth / 2 + unitSz * 2, y: gameHeight / 2},
	{x: gameWidth / 2 + unitSz, y: gameHeight / 2},
	{x: gameWidth / 2, y: gameHeight / 2}
];

Keyboard.Keymap = {
  // Arrow keys
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',

  // WASD keys
  65: 'left',  // 'a' key
  87: 'up',    // 'w' key
  68: 'right', // 'd' key
  83: 'down'   // 's' key~
};

function gameStart(){
	//force restart game if Start button is re-clicked
	if (running) {
		resetGame();
		running = false;
	}
	running = true;
	scoreDisplay.textContent = `Score: ${score}`;
	randomizeFood();
	drawFood();
	nextTick();
};

function nextTick(){
	if(running){
		setTimeout(()=>{
			clearBoard();
			drawFood();
			moveSnake();
			drawSnake();
			checkGameOver();
			nextTick();
		}, 67); //66.67ms = 15fps
	}
	else{
		clearBoard();
		endGame();
		return;
	}
}

function clearBoard(){
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function randomizeFood(){
	function randomFood(min, max){
		const randNum = Math.round((Math.random() * (max - min) + min) / unitSz) * unitSz;
		return randNum;
	}
	xFood = randomFood(0, gameWidth - unitSz);
	yFood = randomFood(0, gameHeight - unitSz);
};

function drawFood(){
	ctx.fillStyle = foodColour;
	ctx.fillRect(xFood, yFood, unitSz, unitSz);

}

function moveSnake() {
	const head = {
		x: (snake[0].x + xVelocity + gameWidth) % gameWidth,
		y: (snake[0].y + yVelocity + gameHeight) % gameHeight
	};
	snake.unshift(head);

	checkGameOver();

	//check if snake ate food
	if (snake[0].x === xFood && snake[0].y === yFood) {
		score++;
		scoreDisplay.textContent = `Score: ${score}`;
		randomizeFood();
	} else {
		snake.pop();
	}
}

function drawSnake() {
	ctx.fillStyle = snakeColour;
	ctx.strokeStyle = snakeBorder;
	
	snake.forEach((snakePart, index) => {
		if (index === 0) {
			ctx.fillStyle = snakeHeadColour;
		} else {
			ctx.fillStyle = snakeColour;
		}
		ctx.fillRect(snakePart.x, snakePart.y, unitSz, unitSz);
		ctx.strokeRect(snakePart.x, snakePart.y, unitSz, unitSz);
	});
}

function changeDirection(event) {
	const keyPressed = event.keyCode;
	const direction = Keyboard.Keymap[keyPressed];

	const up = (yVelocity == -unitSz);
	const down = (yVelocity == unitSz);
	const left = (xVelocity == -unitSz);
	const right = (xVelocity == unitSz);

	switch(direction){
		case "up":
			if(down) return;
			xVelocity = 0;
			yVelocity = -unitSz;
			break;
		case "down":
			if(up) return;
			xVelocity = 0;
			yVelocity = unitSz;
			break;
		case "left":
			if(right) return;
			xVelocity = -unitSz;
			yVelocity = 0;
			break;
		case "right":
			if(left) return;
			xVelocity = unitSz;
			yVelocity = 0;
			break;
	}
}

function checkGameOver(){
	snake.forEach((snakePart, index) => {
		if (index === 0) {
			return;
		}
		if (snakePart.x === snake[0].x && snakePart.y === snake[0].y) {
			endGame();
			return;
		}
	});
};

function resetGame(){
	running = false;
	score = 0;
	xVelocity = unitSz;
	yVelocity = 0;
	snake = [
		{x: gameWidth / 2 + unitSz * 4, y: gameHeight / 2},
		{x: gameWidth / 2 + unitSz * 3, y: gameHeight / 2},
		{x: gameWidth / 2 + unitSz * 2, y: gameHeight / 2},
		{x: gameWidth / 2 + unitSz, y: gameHeight / 2},
		{x: gameWidth / 2, y: gameHeight / 2}
	];
	scoreDisplay.textContent = `Score: ${score}`;
}

function endGame() {
	ctx.font = "60px comic sans ms";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
	running = false;
};


document.addEventListener('DOMContentLoaded', (event) => {
  const startGameBtn = document.getElementById('startGameBtn');
  const resetGameBtn = document.getElementById('resetGameBtn');

  startGameBtn.addEventListener('click', () => {
    running = true;
    console.log('Start button clicked!');
    gameStart();
  });

  resetGameBtn.addEventListener('click', () => {
    console.log('Reset button clicked!');
    resetGame();
  });

  document.addEventListener('keydown', changeDirection);
});