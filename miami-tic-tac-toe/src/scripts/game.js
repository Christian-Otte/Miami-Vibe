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
window.startTicTacToeGame = function(playerNames, playerMode, scoreboard, onGameEnd) {
    // Reset board and UI
    gameBoard.fill('');
    gameActive = true;
    currentPlayer = 'X';
    document.querySelectorAll('.cell').forEach((cell, idx) => {
        cell.innerHTML = '';
        cell.onclick = () => handleCellClick(cell, idx);
    });
    // Show player turn
    const playerTurn = document.getElementById('player-turn');
    function updateTurnLabel() {
        playerTurn.textContent = `${currentPlayer === 'X' ? playerNames.player1 : playerNames.player2}'s turn (${currentPlayer})`;
    }
    updateTurnLabel();

    // Show/hide screens
    document.querySelector('.game-screen').style.display = '';
    document.querySelector('.winner-screen').style.display = 'none';

    // Override handleCellClick for this game session
    function handleCellClickSession(clickedCell, clickedCellIndex) {
        if (gameBoard[clickedCellIndex] !== '' || !gameActive) return;
        gameBoard[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
        updateTurnLabel();
        checkResultSession();
    }
    function checkResultSession() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameBoard[a] === '' || gameBoard[b] === '' || gameBoard[c] === '') continue;
            if (gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                roundWon = true;
                break;
            }
        }
        if (roundWon) {
            console.log('Game ended: WIN detected');
            gameActive = false;
            let winnerName = currentPlayer === 'X' ? playerNames.player1 : playerNames.player2;
            let loserName = currentPlayer === 'X' ? playerNames.player2 : playerNames.player1;
            let result = `${winnerName} (+1) vs ${loserName} (+0): ${winnerName} wins!`;
            console.log('Calling onGameEnd with:', { player1: winnerName, player2: loserName, result });
            onGameEnd({ player1: winnerName, player2: loserName, result });
            // Show winner screen
            document.querySelector('.game-screen').style.display = 'none';
            document.querySelector('.winner-screen').style.display = '';
            document.getElementById('winner-message').textContent = `${winnerName} wins!`;
            // Render scoreboard in winner screen
            const winnerScoreboardList = document.getElementById('winner-scoreboard-list');
            winnerScoreboardList.innerHTML = scoreboard.map(
                s => `<li>${s.player1} vs ${s.player2}: ${s.result}</li>`
            ).join('');
            // Play again button
            document.getElementById('play-again').onclick = () => {
                document.querySelector('.winner-screen').style.display = 'none';
                window.startTicTacToeGame(playerNames, playerMode, scoreboard, onGameEnd);
            };
            return;
        }
        if (!gameBoard.includes('')) {
            console.log('Game ended: DRAW detected');
            gameActive = false;
            onGameEnd({ player1: playerNames.player1, player2: playerNames.player2, result: 'Draw' });
            // Show winner screen for draw
            document.querySelector('.game-screen').style.display = 'none';
            document.querySelector('.winner-screen').style.display = '';
            document.getElementById('winner-message').textContent = 'Draw!';
            const winnerScoreboardList = document.getElementById('winner-scoreboard-list');
            winnerScoreboardList.innerHTML = scoreboard.map(
                s => `<li>${s.player1} vs ${s.player2}: ${s.result}</li>`
            ).join('');
            document.getElementById('play-again').onclick = () => {
                document.querySelector('.winner-screen').style.display = 'none';
                window.startTicTacToeGame(playerNames, playerMode, scoreboard, onGameEnd);
            };
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnLabel();
        // If single player and bot's turn, make bot move
        if (playerMode === 1 && currentPlayer === 'O') {
            setTimeout(botMove, 500);
        }
    }
    function botMove() {
        // Simple bot: pick first empty cell
        let idx = gameBoard.findIndex(cell => cell === '');
        if (idx !== -1) {
            let cell = document.querySelectorAll('.cell')[idx];
            handleCellClickSession(cell, idx);
        }
    }
    // Attach session click handler
    document.querySelectorAll('.cell').forEach((cell, idx) => {
        cell.onclick = () => handleCellClickSession(cell, idx);
    });
    // Reset button
    document.getElementById('reset-game').onclick = () => {
        window.startTicTacToeGame(playerNames, playerMode, scoreboard, onGameEnd);
    };
};