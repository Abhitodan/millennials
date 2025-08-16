// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const gridSize = 20;
const canvasSize = 400;

// Game state
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = generateFood();
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop;

// DOM elements
const currentScoreElement = document.getElementById('currentScore');
const highScoreElement = document.getElementById('highScore');
const gameStatusElement = document.getElementById('gameStatus');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// Mobile controls
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// Initialize game
function initializeGame() {
    updateDisplay();
    
    // Event listeners
    document.addEventListener('keydown', handleKeyPress);
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetGame);
    
    // Mobile controls
    upBtn.addEventListener('click', () => changeDirection(0, -gridSize));
    downBtn.addEventListener('click', () => changeDirection(0, gridSize));
    leftBtn.addEventListener('click', () => changeDirection(-gridSize, 0));
    rightBtn.addEventListener('click', () => changeDirection(gridSize, 0));
    
    // Initial draw
    draw();
}

// Generate food at random position
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
}

// Handle keyboard input
function handleKeyPress(event) {
    if (!gameRunning && event.key === ' ') {
        startGame();
        return;
    }
    
    if (gameRunning && event.key === ' ') {
        togglePause();
        return;
    }
    
    if (gamePaused) return;
    
    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            changeDirection(0, -gridSize);
            break;
        case 'ArrowDown':
            event.preventDefault();
            changeDirection(0, gridSize);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            changeDirection(-gridSize, 0);
            break;
        case 'ArrowRight':
            event.preventDefault();
            changeDirection(gridSize, 0);
            break;
    }
}

// Change snake direction
function changeDirection(newX, newY) {
    if (!gameRunning || gamePaused) return;
    
    // Prevent reversing into itself
    if (newX === -direction.x && newY === -direction.y) return;
    
    direction = { x: newX, y: newY };
}

// Start the game
function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    gamePaused = false;
    direction = { x: gridSize, y: 0 }; // Start moving right
    
    updateStatus('Game started! Use arrow keys to move');
    
    gameLoop = setInterval(update, 150);
    
    // Update button states
    startBtn.disabled = true;
    pauseBtn.disabled = false;
}

// Toggle pause
function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        clearInterval(gameLoop);
        updateStatus('Game paused - Press SPACE to resume');
        pauseBtn.textContent = 'Resume';
    } else {
        gameLoop = setInterval(update, 150);
        updateStatus('Game resumed!');
        pauseBtn.textContent = 'Pause';
    }
}

// Reset the game
function resetGame() {
    clearInterval(gameLoop);
    
    // Reset game state
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    food = generateFood();
    score = 0;
    gameRunning = false;
    gamePaused = false;
    
    // Update display
    updateDisplay();
    updateStatus('Press SPACE to start or use arrow keys to move');
    draw();
    
    // Reset buttons
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
}

// Update game state
function update() {
    if (gamePaused) return;
    
    // Move snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    // Check wall collision
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameOver();
        return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = generateFood();
        updateDisplay();
        
        // Play eat sound effect (visual feedback)
        flashCanvas('#4CAF50');
    } else {
        snake.pop();
    }
    
    draw();
}

// Game over
function gameOver() {
    clearInterval(gameLoop);
    gameRunning = false;
    gamePaused = false;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        updateStatus(`New High Score: ${score}! Game Over - Press SPACE to restart`);
    } else {
        updateStatus(`Game Over! Score: ${score} - Press SPACE to restart`);
    }
    
    updateDisplay();
    
    // Game over animation
    canvas.classList.add('game-over');
    setTimeout(() => {
        canvas.classList.remove('game-over');
    }, 1500);
    
    // Reset buttons
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
}

// Flash canvas for visual feedback
function flashCanvas(color) {
    const originalColor = canvas.style.backgroundColor;
    canvas.style.backgroundColor = color;
    setTimeout(() => {
        canvas.style.backgroundColor = originalColor;
    }, 100);
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    // Draw snake
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw head slightly different
            ctx.fillStyle = '#66BB6A';
        } else {
            ctx.fillStyle = '#4CAF50';
        }
        ctx.fillRect(segment.x, segment.y, gridSize - 2, gridSize - 2);
    });
    
    // Draw food
    ctx.fillStyle = '#f44336';
    ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
    
    // Add slight border effect to food
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.strokeRect(food.x, food.y, gridSize - 2, gridSize - 2);
}

// Update display elements
function updateDisplay() {
    currentScoreElement.textContent = score;
    highScoreElement.textContent = highScore;
}

// Update status message
function updateStatus(message) {
    gameStatusElement.textContent = message;
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);