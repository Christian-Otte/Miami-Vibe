// Game logic for Tic Tac Toe

const gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

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

// Utility to get icon for X/O
function getIcon(mark) {
    return mark === 'X' ? '🚗' : (mark === 'O' ? '🔫' : '');
}

// Add sound effects for car and pistol
const carSound = new Audio('assets/car.wav');
const pistolSound = new Audio('assets/pistol.wav');

function playCarSound() {
    carSound.currentTime = 0;
    carSound.play();
    setTimeout(() => { carSound.pause(); carSound.currentTime = 0; }, 1000);
}
function playPistolSound() {
    pistolSound.currentTime = 0;
    pistolSound.play();
    setTimeout(() => { pistolSound.pause(); pistolSound.currentTime = 0; }, 1000);
}

function handleCellClick(clickedCell, clickedCellIndex) {
    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameBoard[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    checkResult();
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameBoard[a] === '' || gameBoard[b] === '' || gameBoard[c] === '') {
            continue;
        }
        if (gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        updateScore(currentPlayer);
        gameActive = false;
        return;
    }

    if (!gameBoard.includes('')) {
        gameActive = false;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function updateScore(winner) {
    if (winner === 'X') {
        playerXScore++;
    } else {
        playerOScore++;
    }
    // Update the score display in the UI
}

function resetGame() {
    gameBoard.fill('');
    gameActive = true;
    currentPlayer = 'X';
    // Reset the UI
}

// Add global function to start a game with player names and mode
window.startTicTacToeGame = function(playerNames, playerMode, scoreboard, onGameEnd, botDifficulty = 'easy', gridSize = 3) {
    // Generate board and state
    const totalCells = gridSize * gridSize;
    let gameBoard = Array(totalCells).fill('');
    let gameActive = true;
    let currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
    // Render board
    const boardContainer = document.getElementById('game-board');
    boardContainer.innerHTML = '';
    boardContainer.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    boardContainer.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        boardContainer.appendChild(cell);
    }
    // Generate winning conditions
    function getWinningConditions(size) {
        const wins = [];
        // Rows
        for (let r = 0; r < size; r++) {
            const row = [];
            for (let c = 0; c < size; c++) row.push(r * size + c);
            wins.push(row);
        }
        // Columns
        for (let c = 0; c < size; c++) {
            const col = [];
            for (let r = 0; r < size; r++) col.push(r * size + c);
            wins.push(col);
        }
        // Diagonal TL-BR
        const diag1 = [];
        for (let i = 0; i < size; i++) diag1.push(i * size + i);
        wins.push(diag1);
        // Diagonal TR-BL
        const diag2 = [];
        for (let i = 0; i < size; i++) diag2.push(i * size + (size - 1 - i));
        wins.push(diag2);
        return wins;
    }
    const winningConditions = getWinningConditions(gridSize);
    // Show player turn
    const playerTurn = document.getElementById('player-turn');
    function updateTurnLabel() {
        playerTurn.textContent = `${currentPlayer === 'X' ? playerNames.player1 : playerNames.player2}'s turn (${getIcon(currentPlayer)})`;
    }
    updateTurnLabel();

    // Show/hide screens
    document.querySelector('.game-screen').style.display = '';
    document.querySelector('.winner-screen').style.display = 'none';

    // Add sound error handling for car.wav
    carSound.onerror = function() {
        console.warn('Car sound file not found or cannot be played.');
    };

    // After setup, if single player and bot goes first, make bot move
    if (playerMode === 1 && currentPlayer === 'O') {
        setTimeout(botMove, 500);
    }

    // Helper to show winner modal
    function showWinnerModal(message, scoreboard) {
        alert(message + '\n' + scoreboard.map(s => `${s.player1} vs ${s.player2}: ${s.result}`).join('\n'));
        window.startTicTacToeGame(playerNames, playerMode, scoreboard, onGameEnd, botDifficulty, gridSize);
    }

    // Override handleCellClick for this game session
    let soundPlaying = false;
    function handleCellClickSession(clickedCell, clickedCellIndex) {
        if (gameBoard[clickedCellIndex] !== '' || !gameActive || soundPlaying) return;
        soundPlaying = true;
        gameBoard[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = getIcon(currentPlayer);
        // Play sound effect based on icon
        if (currentPlayer === 'X') {
            try { playCarSound(); } catch (e) { console.warn('Car sound error:', e); }
        } else {
            try { playPistolSound(); } catch (e) { console.warn('Pistol sound error:', e); }
        }
        setTimeout(() => {
            soundPlaying = false;
            updateTurnLabel();
            checkResultSession();
        }, 1000);
    }
    function checkResultSession() {
        let roundWon = false;
        let winningRow = null;
        for (let i = 0; i < winningConditions.length; i++) {
            const win = winningConditions[i];
            if (win.some(idx => gameBoard[idx] === '')) continue;
            if (win.every(idx => gameBoard[idx] === currentPlayer)) {
                roundWon = true;
                winningRow = win;
                break;
            }
        }
        if (roundWon) {
            gameActive = false;
            let winnerName = currentPlayer === 'X' ? playerNames.player1 : playerNames.player2;
            let loserName = currentPlayer === 'X' ? playerNames.player2 : playerNames.player1;
            let result = `${winnerName} (+1) vs ${loserName} (+0): ${winnerName} wins!`;
            onGameEnd({ player1: winnerName, player2: loserName, result });
            if (winningRow) {
                winningRow.forEach(idx => {
                    boardContainer.children[idx].classList.add('winner');
                });
            }
            document.querySelector('.winner-screen').style.display = '';
            document.getElementById('winner-message').textContent = `${winnerName} wins!`;
            return;
        }
        if (!gameBoard.includes('')) {
            gameActive = false;
            onGameEnd({ player1: playerNames.player1, player2: playerNames.player2, result: 'Draw' });
            document.querySelector('.winner-screen').style.display = '';
            document.getElementById('winner-message').textContent = `It's a draw!`;
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnLabel();
        if (playerMode === 1 && currentPlayer === 'O') {
            setTimeout(botMove, 500);
        }
    }
    function botMove() {
        if (botDifficulty === 'easy') {
            // Easy: random move
            let emptyCells = [];
            for (let i = 0; i < totalCells; i++) {
                if (gameBoard[i] === '') emptyCells.push(i);
            }
            if (emptyCells.length > 0) {
                let idx = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                let cell = boardContainer.children[idx];
                cell.innerHTML = getIcon('O');
                playPistolSound();
                handleCellClickSession(cell, idx);
            }
        } else if (botDifficulty === 'normal') {
            // Normal: win, block, random (no cheating)
            for (let i = 0; i < totalCells; i++) {
                if (gameBoard[i] === '') {
                    gameBoard[i] = 'O';
                    if (isWinningMove('O')) {
                        let cell = boardContainer.children[i];
                        cell.innerHTML = getIcon('O');
                        playPistolSound();
                        handleCellClickSession(cell, i);
                        return;
                    }
                    gameBoard[i] = '';
                }
            }
            for (let i = 0; i < totalCells; i++) {
                if (gameBoard[i] === '') {
                    gameBoard[i] = 'X';
                    if (isWinningMove('X')) {
                        gameBoard[i] = 'O';
                        let cell = boardContainer.children[i];
                        cell.innerHTML = getIcon('O');
                        playPistolSound();
                        handleCellClickSession(cell, i);
                        return;
                    }
                    gameBoard[i] = '';
                }
            }
            let emptyCells = [];
            for (let i = 0; i < totalCells; i++) {
                if (gameBoard[i] === '') emptyCells.push(i);
            }
            if (emptyCells.length > 0) {
                let idx = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                let cell = boardContainer.children[idx];
                cell.innerHTML = getIcon('O');
                playPistolSound();
                handleCellClickSession(cell, idx);
            }
        } else if (botDifficulty === 'cheater') {
            // Cheater: subtle cheating, rarely overwrites a cell
            let didCheat = false;
            if (Math.random() < 0.15) { // 15% chance to cheat
                let nonEmptyCells = [];
                for (let i = 0; i < totalCells; i++) {
                    if (gameBoard[i] === 'X') nonEmptyCells.push(i);
                }
                if (nonEmptyCells.length > 0) {
                    let idx = nonEmptyCells[Math.floor(Math.random() * nonEmptyCells.length)];
                    gameBoard[idx] = 'O';
                    let cell = boardContainer.children[idx];
                    cell.innerHTML = getIcon('O');
                    handleCellClickSession(cell, idx);
                    didCheat = true;
                }
            }
            if (didCheat) {
                playPistolSound();
            }
            if (!didCheat) {
                // Otherwise, play like normal bot
                for (let i = 0; i < totalCells; i++) {
                    if (gameBoard[i] === '') {
                        gameBoard[i] = 'O';
                        if (isWinningMove('O')) {
                            let cell = boardContainer.children[i];
                            cell.innerHTML = getIcon('O');
                            playPistolSound();
                            handleCellClickSession(cell, i);
                            return;
                        }
                        gameBoard[i] = '';
                    }
                }
                for (let i = 0; i < totalCells; i++) {
                    if (gameBoard[i] === '') {
                        gameBoard[i] = 'X';
                        if (isWinningMove('X')) {
                            gameBoard[i] = 'O';
                            let cell = boardContainer.children[i];
                            cell.innerHTML = getIcon('O');
                            playPistolSound();
                            handleCellClickSession(cell, i);
                            return;
                        }
                        gameBoard[i] = '';
                    }
                }
                let emptyCells = [];
                for (let i = 0; i < totalCells; i++) {
                    if (gameBoard[i] === '') emptyCells.push(i);
                }
                if (emptyCells.length > 0) {
                    let idx = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                    let cell = boardContainer.children[idx];
                    cell.innerHTML = getIcon('O');
                    playPistolSound();
                    handleCellClickSession(cell, idx);
                }
            }
        }
    }
    function isWinningMove(mark) {
        return winningConditions.some(win => win.every(idx => gameBoard[idx] === mark));
    }
    // Attach session click handler
    for (let i = 0; i < totalCells; i++) {
        boardContainer.children[i].onclick = () => handleCellClickSession(boardContainer.children[i], i);
    }
    // Clear winner highlight on new game
    for (let i = 0; i < totalCells; i++) {
        boardContainer.children[i].classList.remove('winner');
    }
    // Reset button
    document.getElementById('reset-game').onclick = () => {
        window.startTicTacToeGame(playerNames, playerMode, scoreboard, onGameEnd, botDifficulty, gridSize);
    };
    // Return to main button
    document.getElementById('return-main').onclick = () => {
        document.querySelector('.game-screen').style.display = 'none';
        document.querySelector('.winner-screen').style.display = 'none';
        document.querySelector('.welcome-screen').style.display = '';
    };
};