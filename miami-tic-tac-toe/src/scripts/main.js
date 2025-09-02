// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Always 2 player mode
    const startButton = document.getElementById('start-game');
    const player1Input = document.getElementById('player1-name');
    const player2Input = document.getElementById('player2-name');
    const scoreboardList = document.getElementById('scoreboard-list');
    const welcomeScreen = document.querySelector('.welcome-screen');
    const gameScreen = document.querySelector('.game-screen');

    let scoreboard = [];
    let playerNames = { player1: '', player2: '' };

    // Hide any single player options if present
    if (document.getElementById('player-mode')) {
        document.getElementById('player-mode').style.display = 'none';
    }
    if (player2Input) {
        player2Input.style.display = '';
    }

    // Detect player mode from dropdown (if present)
    let playerMode = 2;
    const playerModeSelect = document.getElementById('player-mode');
    if (playerModeSelect) {
        playerMode = parseInt(playerModeSelect.value, 10);
        playerModeSelect.addEventListener('change', () => {
            playerMode = parseInt(playerModeSelect.value, 10);
            if (playerMode === 1) {
                player2Input.style.display = 'none';
            } else {
                player2Input.style.display = '';
            }
        });
    }

    // Store last used playerMode for Play Again
    let lastPlayerMode = playerMode;

    // Render scoreboard
    function renderScoreboard() {
        scoreboardList.innerHTML = scoreboard.map(
            s => `<li>${s.player1} vs ${s.player2}: ${s.result}</li>`
        ).join('');
    }

    // Show winner screen and update scoreboard after game ends
    function handleGameEnd(result) {
        scoreboard.push(result);
        renderScoreboard();
        gameScreen.style.display = 'none';
        const winnerScreen = document.querySelector('.winner-screen');
        winnerScreen.style.display = '';
        document.getElementById('winner-message').textContent = result.result.includes('Draw') ? 'Draw!' : `${result.player1} wins!`;
        const winnerScoreboardList = document.getElementById('winner-scoreboard-list');
        winnerScoreboardList.innerHTML = scoreboard.map(
            s => `<li>${s.player1} vs ${s.player2}: ${s.result}</li>`
        ).join('');
        document.getElementById('play-again').onclick = () => {
            winnerScreen.style.display = 'none';
            welcomeScreen.style.display = 'none';
            gameScreen.style.display = '';
            window.startTicTacToeGame(playerNames, lastPlayerMode, scoreboard, handleGameEnd);
        };
    }

    // Start game button
    startButton.addEventListener('click', () => {
        playerNames.player1 = player1Input.value.trim() || 'Player 1';
        playerNames.player2 = player2Input.value.trim() || (playerMode === 1 ? 'Bot' : 'Player 2');
        lastPlayerMode = playerMode;
        welcomeScreen.style.display = 'none';
        gameScreen.style.display = '';
        window.startTicTacToeGame(playerNames, playerMode, scoreboard, handleGameEnd);
    });

    renderScoreboard();
});