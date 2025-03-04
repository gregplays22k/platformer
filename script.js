const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const end = document.getElementById('end');

let playerX = 100;
let playerY = 0;
let playerVelocityX = 0;
let playerVelocityY = 0;
const gravity = 0.5;
const jumpForce = -10;
let isJumping = false;
let platforms = [];
let enemies = [];
let spikes = [];
let lastCheckpointX = 100;

let cameraX = 0;
let endX = 10000; // Far end

end.style.left = endX + "px";
end.style.bottom = "100px";

function createPlatform(x, y, width, height) {
  const platform = document.createElement('div');
  platform.className = 'platform';
  platform.style.left = x + 'px';
  platform.style.bottom = y + 'px';
  platform.style.width = width + 'px';
  platform.style.height = height + 'px';
  gameContainer.appendChild(platform);
  platforms.push({ element: platform, x, y, width, height });
}

function createEnemy(x, y) {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.left = x + 'px';
    enemy.style.bottom = y + 'px';
    gameContainer.appendChild(enemy);
    enemies.push({element: enemy, x, y});
}

function createSpike(x,y){
    const spike = document.createElement('div');
    spike.className = 'spike';
    spike.style.left = x + 'px';
    spike.style.bottom = y + 'px';
    gameContainer.appendChild(spike);
    spikes.push({element: spike, x, y});
}

function generatePlatforms() {
  if (playerX > cameraX + window.innerWidth - 500) {
    cameraX += 200;
    const platformX = cameraX + window.innerWidth + Math.random() * 200;
    const platformY = Math.random() * 200;
    const platformWidth = Math.random() * 200 + 50;
    const platformHeight = 20; // Fixed block height

    createPlatform(platformX, platformY, platformWidth, platformHeight);

    if(Math.random() < 0.2){
        createEnemy(platformX + Math.random() * platformWidth, platformY + platformHeight);
    }
    if(Math.random() < 0.1){
        createSpike(platformX + Math.random() * platformWidth, platformY + platformHeight);
    }
  }
}

function updatePlayer() {
  playerX += playerVelocityX;
  playerY += playerVelocityY;
  playerVelocityY += gravity;

  // Collision detection (simplified)
  let isGrounded = false;
  platforms.forEach(platform => {
    if (playerX < platform.x + platform.width &&
        playerX + 20 > platform.x &&
        playerY < platform.y + platform.height &&
        playerY + 30 > platform.y) {
      if (playerVelocityY > 0) {
        playerY = platform.y + platform.height;
        playerVelocityY = 0;
        isGrounded = true;
      } else {
        playerY = platform.y - 30;
        playerVelocityY = 0;
        isGrounded = true;
      }
    }
  });

  if (isGrounded) {
    isJumping = false;
  }

  enemies.forEach(enemy =>{
    if(playerX < enemy.x + 20 && playerX +20 > enemy.x && playerY < enemy.y +20 && playerY +30 > enemy.y){
        die();
    }
  });

  spikes.forEach(spike =>{
    if(playerX < spike.x + 10 && playerX +20 > spike.x && playerY < spike.y +10 && playerY +30 > spike.y){
        die();
    }
  });

  if(playerX +20 > endX && playerY + 30 > 100){
      win();
  }

  player.style.left = playerX - cameraX + 'px';
  player.style.bottom = playerY + 'px';
}

function die(){
    playerX = lastCheckpointX;
    playerY = 0;
    playerVelocityX = 0;
    playerVelocityY = 0;
}

function win(){
    alert("You Win!");
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    playerVelocityX = -5;
  } else if (event.key === 'ArrowRight') {
    playerVelocityX = 5;
  } else if (event.key === ' ') {
    if (!isJumping) {
      playerVelocityY = jumpForce;
      isJumping = true;
    }
  } else if (event.key === 'r'){
    die();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    playerVelocityX = 0;
  }
});

function gameLoop() {
  generatePlatforms();
  updatePlayer();
  requestAnimationFrame(gameLoop);
}

gameLoop();
