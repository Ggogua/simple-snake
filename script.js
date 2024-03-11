const boardSize = 20;
const cellSize = 20;
const initialSnakeLength = 5;

let snake = [];
let direction = "right";
let food = { x: 0, y: 0 };
let intervalId;
let gameIsOver = false;
let score = 0;

function initializeGame() {
  createSnake();
  createFood();
  setPace("medium");
  document.addEventListener("keydown", changeDirection);
}

function createSnake() {
  for (let i = initialSnakeLength - 1; i >= 0; i--) {
    snake.push({ x: i, y: 0 });
  }
}

function createFood() {
  food.x = Math.floor(Math.random() * boardSize);
  food.y = Math.floor(Math.random() * boardSize);

  while (isFoodOnSnake()) {
    food.x = Math.floor(Math.random() * boardSize);
    food.y = Math.floor(Math.random() * boardSize);
  }

  drawFood();
}

function isFoodOnSnake() {
  return snake.some((segment) => segment.x === food.x && segment.y === food.y);
}

function moveSnake() {
  if (gameIsOver) return;

  const head = { ...snake[0] };

  switch (direction) {
    case "up":
      head.y = (head.y - 1 + boardSize) % boardSize;
      break;
    case "down":
      head.y = (head.y + 1) % boardSize;
      break;
    case "left":
      head.x = (head.x - 1 + boardSize) % boardSize;
      break;
    case "right":
      head.x = (head.x + 1) % boardSize;
      break;
  }

  if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
    handleGameOver();
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    snake.unshift({ ...food });
    createFood();
    score += 10;
    updateScore();
  } else {
    snake.unshift(head);
    snake.pop();
  }

  if (isSnakeCollision()) {
    handleGameOver();
    return;
  }

  drawSnake();
}

function handleGameOver() {
  gameIsOver = true;
  clearInterval(intervalId);
  alert(
    `Game over! Your score: ${score}. You hit the borders or collided with yourself.`
  );
  snake = [];
  gameIsOver = false;
  score = 0;
  updateScore();
  initializeGame();
}

function isSnakeCollision() {
  const head = snake[0];
  return snake
    .slice(1)
    .some((segment) => segment.x === head.x && segment.y === head.y);
}

function drawSnake() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  snake.forEach((segment) => {
    const snakeElement = document.createElement("div");
    snakeElement.className = "snake";
    snakeElement.style.left = `${segment.x * cellSize}px`;
    snakeElement.style.top = `${segment.y * cellSize}px`;
    gameBoard.appendChild(snakeElement);
  });

  drawFood();
}

function drawFood() {
  const gameBoard = document.getElementById("game-board");
  const foodElement = document.createElement("div");
  foodElement.className = "food";
  foodElement.style.left = `${food.x * cellSize}px`;
  foodElement.style.top = `${food.y * cellSize}px`;
  gameBoard.appendChild(foodElement);
}

function changeDirection(event) {
  const newDirection = getNewDirection(event.key);
  if (newDirection && newDirection !== getOppositeDirection(direction)) {
    direction = newDirection;
  }
}

function getNewDirection(key) {
  switch (key) {
    case "ArrowUp":
      return "up";
    case "ArrowDown":
      return "down";
    case "ArrowLeft":
      return "left";
    case "ArrowRight":
      return "right";
    default:
      return null;
  }
}

function getOppositeDirection(dir) {
  switch (dir) {
    case "up":
      return "down";
    case "down":
      return "up";
    case "left":
      return "right";
    case "right":
      return "left";
    default:
      return null;
  }
}

function setPace(pace) {
  clearInterval(intervalId);

  switch (pace) {
    case "slow":
      intervalId = setInterval(moveSnake, 200);
      break;
    case "medium":
      intervalId = setInterval(moveSnake, 100);
      break;
    case "fast":
      intervalId = setInterval(moveSnake, 50);
      break;
  }
}

function updateScore() {
  document.getElementById("score").textContent = `Score: ${score}`;
}

initializeGame();
