let startTime;
let clicks = 0;
let totalReactionTime = 0;
let gameTime = 15;
let interval;
let circle = document.getElementById("circle");
let timeLeftElement = document.getElementById("time-left");
let clicksElement = document.getElementById("clicks");
let avgReactionTimeElement = document.getElementById("avg-reaction-time");

function startGame() {
  // Start the game timer
  interval = setInterval(() => {
    gameTime--;
    timeLeftElement.textContent = gameTime;
    if (gameTime <= 0) {
      clearInterval(interval);
      showGameEndScreen();
    }
  }, 1000);

  // Start the first circle
  moveCircle();
}

function moveCircle() {
  let randomX = Math.floor(Math.random() * (window.innerWidth - 100));
  let randomY = Math.floor(Math.random() * (window.innerHeight - 100));
  
  circle.style.left = randomX + "px";
  circle.style.top = randomY + "px";
  
  // Record the time when the circle appears
  startTime = Date.now();
}

circle.addEventListener("click", () => {
  if (gameTime > 0) {
    let reactionTime = Date.now() - startTime;
    totalReactionTime += reactionTime;
    clicks++;
    
    // Update clicks and average reaction time
    clicksElement.textContent = clicks;
    avgReactionTimeElement.textContent = (totalReactionTime / clicks).toFixed(2);

    // Move the circle to a new position
    moveCircle();
  }
});

function showGameEndScreen() {
  let averageReactionTime = (totalReactionTime / clicks).toFixed(2);
  avgReactionTimeElement.textContent = averageReactionTime + " ms";
  alert(`Game Over! Your average reaction time is ${averageReactionTime} ms.`);
}

// Start the game when the page is loaded
startGame();
