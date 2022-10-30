//Variables
let gameStatus = true;
let gameOver = false;
const gameBoard = document.getElementById('game-board');
const GRID_SIZE = 27;
let speed = 3;
const EXPANSION_RATE = 1;
const snakeBody = [
  { x: 13, y: 13 }
];
let level = 0;
let bodySegments = 0;
let food = randomPosition();
let lastUpdate = 0;
let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 }
window.requestAnimationFrame(loop);

//Preparation functions
function randomPosition() {
  return{
    x : Math.floor((Math.random() * GRID_SIZE) + 1),
    y : Math.floor((Math.random() * GRID_SIZE) + 1)
   }
}

function foodPosition() {
  let newFoodPosition = null;
  while (newFoodPosition == null || eattenFood(newFoodPosition)) {
    newFoodPosition = randomPosition();
  }
  return newFoodPosition;
}

function gridSpace(position) {
  return (position.x < 1 || position.x > GRID_SIZE || position.y < 1 || position.y > GRID_SIZE)
}

//Snake functions
function updateSnake() {
  growSnake();
  const inputDirection = getInputDirection();
  lastInputDirection = inputDirection;
  for (let i = snakeBody.length - 2; i >= 0; --i) {
    snakeBody[i + 1] = {...snakeBody[i]};
  }
  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;
}

function drawSnake(gameBoard) {
  snakeBody.forEach(segment => {
    const snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.classList.add('snake');
    gameBoard.appendChild(snakeElement);
  })
}
            
function growSnake() {
  for (let i = 0; i < bodySegments; ++i) {
    snakeBody.push({...snakeBody[snakeBody.length - 1]});
  }
  bodySegments = 0;
}

function expandSnake(newSegment) {
  bodySegments += newSegment;
  ++level;
  document.getElementById('level').innerHTML = level;
  if (level % 2 == 0) {
    speed += 1;
  }
}

function eattenFood(position, { ignoreHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index === 0) return false;
    return samePositions(segment, position)
  })
}

function outsideGrid(position) {
  return position.x < 1 || position.x > GRID_SIZE || position.y < 1 || position.y > GRID_SIZE;            
}
            
function checkCollision() {
  return eattenFood(snakeBody[0], { ignoreHead: true })
}

function snakeHead() {
  return snakeBody[0];
}

//Food functions
function drawFood() {
  const foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add('food');
  gameBoard.appendChild(foodElement);
}

function updateFood() {
  if (eattenFood(food)) {
    expandSnake(EXPANSION_RATE);
    food = foodPosition();
  }
}

function samePositions(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

//Input
window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowDown':
      if (lastInputDirection.y !== 0) break;
      inputDirection = { x: 0, y: 1};
      break;
    case 'ArrowUp':
      if (lastInputDirection.y !== 0) break;
      inputDirection = { x: 0, y: -1};
      break;
    case 'ArrowRight':
      if(lastInputDirection.x !== 0) break;
      inputDirection = { x: 1, y: 0}
      break;
    case 'ArrowLeft':
      if (lastInputDirection.x !== 0) break;
      inputDirection = { x: -1, y: 0}
      break;
  }
})

//Running functions
function loop(currentTime) {
  if (gameOver) {
    let gameOverMessage = document.getElementById("gameMessage");
    gameOverMessage.innerHTML = "Game over!";
    return;
  }
  window.requestAnimationFrame(loop);
  const secondsLastUpdate = (currentTime - lastUpdate) / 1000;
  if (secondsLastUpdate < 1 / speed) {
    return;
  }
  lastUpdate = currentTime;
  update();
  draw();
}

function update() {
  updateSnake();
  updateFood();
  checkDeath();
}

function draw() {
  gameBoard.innerHTML = '';
  drawSnake(gameBoard);
  drawFood(gameBoard);
}

function getInputDirection() {
  lastInputDirection = inputDirection;
  return inputDirection;
}

function checkDeath() {
  gameOver = outsideGrid(snakeHead()) || checkCollision();
}

function restartGame() {
  document.location.reload();
}
