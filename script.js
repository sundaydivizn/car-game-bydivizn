const playerCar = document.getElementById("player-car");
const obstaclesContainer = document.getElementById("obstacles-container");
const scoreText = document.getElementById("score");
const highscoreText = document.getElementById("highscore");
const levelText = document.getElementById("level");
const playBtn = document.getElementById("play-btn");
const restartBtn = document.getElementById("restart-btn");
const countdown = document.getElementById("countdown");

let carPosition = 225;
let carSpeed = 25;
let boardWidth = 500;
let score = 0;
let highScore = 0;
let level = 1;
let speed = 3;
let gameRunning = false;
let obstacleInterval;

playBtn.addEventListener("click", () => {
  playBtn.style.display = "none";
  showCountdown(() => {
    startGame();
    setupControls();
  });
});

restartBtn.addEventListener("click", () => {
  restartBtn.style.display = "none";
  showCountdown(() => {
    startGame();
    setupControls();
  });
});

function startGame() {
  score = 0;
  level = 1;
  speed = 3;
  carPosition = 225;
  gameRunning = true;
  playerCar.style.left = carPosition + "px";
  playerCar.style.display = "block";
  obstaclesContainer.innerHTML = "";
  scoreText.textContent = score;
  levelText.textContent = level;
  document.querySelectorAll('.explosion').forEach(e => e.remove());
  obstacleInterval = setInterval(createObstacle, 1000);
}

function setupControls() {
  document.onkeydown = (e) => {
    if (!gameRunning) return;
    if (e.key === "ArrowLeft" && carPosition > 0) {
      carPosition -= carSpeed;
    } else if (e.key === "ArrowRight" && carPosition < boardWidth - 50) {
      carPosition += carSpeed;
    }
    playerCar.style.left = carPosition + "px";
  };
}

function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.left = Math.floor(Math.random() * (boardWidth - 50)) + "px";
  obstaclesContainer.appendChild(obstacle);
  moveObstacle(obstacle);
}

function moveObstacle(obstacle) {
  let top = -120;

  function fall() {
    if (!gameRunning) return;
    top += speed;
    obstacle.style.top = top + "px";

    if (top > 600) {
      obstacle.remove();
      increaseScore();
      return;
    }

    if (checkCollision(playerCar, obstacle)) {
      explodeAt(playerCar.offsetLeft, playerCar.offsetTop);
      endGame();
      return;
    }

    requestAnimationFrame(fall);
  }

  requestAnimationFrame(fall);
}

function checkCollision(car, obs) {
  const carRect = car.getBoundingClientRect();
  const obsRect = obs.getBoundingClientRect();

  return (
    carRect.left < obsRect.right &&
    carRect.right > obsRect.left &&
    carRect.top < obsRect.bottom &&
    carRect.bottom > obsRect.top
  );
}

function explodeAt(x, y) {
  const explosion = document.createElement("div");
  explosion.classList.add("explosion");
  explosion.style.left = x + "px";
  explosion.style.top = y + "px";
  document.getElementById("game-board").appendChild(explosion);

  setTimeout(() => {
    explosion.remove();
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(obstacleInterval);
  if (score > highScore) {
    highScore = score;
    highscoreText.textContent = highScore;
  }
  restartBtn.style.display = "inline-block";
}

function increaseScore() {
  score++;
  scoreText.textContent = score;

  if (score % 5 === 0) {
    level++;
    levelText.textContent = level;
    speed += 0.5;
  }
}

function showCountdown(callback) {
  let count = 3;
  countdown.textContent = count;
  countdown.style.display = "block";

  const countdownInterval = setInterval(() => {
    count--;
    if (count === 0) {
      clearInterval(countdownInterval);
      countdown.style.display = "none";
      callback();
    } else {
      countdown.textContent = count;
    }
  }, 1000);
}
