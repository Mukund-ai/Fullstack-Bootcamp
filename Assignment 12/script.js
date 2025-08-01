const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('reset');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill('');

const winConditions = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
];

function handleCellClick(e) {
    const idx = +e.target.getAttribute('data-index');
    if (gameState[idx] !== '' || !gameActive) return;
    gameState[idx] = currentPlayer;
    e.target.textContent = currentPlayer;
    if (checkWin()) {
        statusDiv.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
    } else if (gameState.every(cell => cell !== '')) {
        statusDiv.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkWin() {
    return winConditions.some(comb => {
        return comb.every(idx => gameState[idx] === currentPlayer);
    });
}

function resetGame() {
    gameState = Array(9).fill('');
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    gameActive = true;
    statusDiv.textContent = "Player X's turn";
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);