// Game variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scores = {
    x: 0,
    o: 0,
    draws: 0
};

// Winning combinations
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// DOM elements
const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('gameStatus');
const currentPlayerDisplay = document.getElementById('currentPlayerDisplay');
const xWinsElement = document.getElementById('xWins');
const oWinsElement = document.getElementById('oWins');
const drawsElement = document.getElementById('draws');
const resetBtn = document.getElementById('resetBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');

// Initialize game
function initializeGame() {
    cells.forEach((cell, index) => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetBtn.addEventListener('click', resetGame);
    resetScoreBtn.addEventListener('click', resetScore);
    
    loadScores();
    updateDisplay();
}

// Handle cell click
function handleCellClick(e) {
    const cellIndex = e.target.getAttribute('data-cell-index');
    
    if (gameBoard[cellIndex] !== '' || !gameActive) {
        return;
    }
    
    makeMove(cellIndex);
    checkResult();
}

// Make a move
function makeMove(cellIndex) {
    gameBoard[cellIndex] = currentPlayer;
    cells[cellIndex].textContent = currentPlayer;
    cells[cellIndex].classList.add(currentPlayer.toLowerCase());
}

// Check game result
function checkResult() {
    let roundWon = false;
    let winningCombination = [];
    
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameBoard[winCondition[0]];
        const b = gameBoard[winCondition[1]];
        const c = gameBoard[winCondition[2]];
        
        if (a === '' || b === '' || c === '') {
            continue;
        }
        
        if (a === b && b === c) {
            roundWon = true;
            winningCombination = winCondition;
            break;
        }
    }
    
    if (roundWon) {
        gameStatus.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        highlightWinningCells(winningCombination);
        updateScore(currentPlayer);
        return;
    }
    
    if (!gameBoard.includes('')) {
        gameStatus.textContent = 'Game ended in a draw!';
        gameActive = false;
        updateScore('draw');
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateDisplay();
}

// Highlight winning cells
function highlightWinningCells(winningCombination) {
    winningCombination.forEach(index => {
        cells[index].classList.add('winning');
    });
}

// Update display
function updateDisplay() {
    currentPlayerDisplay.textContent = currentPlayer;
    currentPlayerDisplay.className = currentPlayer === 'X' ? 'player-x' : 'player-o';
    
    if (gameActive) {
        gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// Update score
function updateScore(winner) {
    if (winner === 'X') {
        scores.x++;
    } else if (winner === 'O') {
        scores.o++;
    } else {
        scores.draws++;
    }
    
    updateScoreDisplay();
    saveScores();
}

// Update score display
function updateScoreDisplay() {
    xWinsElement.textContent = scores.x;
    oWinsElement.textContent = scores.o;
    drawsElement.textContent = scores.draws;
}

// Reset game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });
    
    updateDisplay();
}

// Reset score
function resetScore() {
    scores = { x: 0, o: 0, draws: 0 };
    updateScoreDisplay();
    saveScores();
}

// Save scores to localStorage
function saveScores() {
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
}

// Load scores from localStorage
function loadScores() {
    const savedScores = localStorage.getItem('ticTacToeScores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
        updateScoreDisplay();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);