// main.js

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const gameContainer = document.getElementById('game-container');
    const welcomeContainer = document.getElementById('welcome-container');
    const usernameInput = document.getElementById('username-input');
    const usernameDisplay = document.getElementById('username-display');
    const scoreDisplay = document.getElementById('score-display');

    let username = '';
    let playerScores = { player1: 0, player2: 0 };

    startButton.addEventListener('click', () => {
        username = usernameInput.value.trim();
        if (username) {
            usernameDisplay.textContent = username;
            welcomeContainer.style.display = 'none';
            gameContainer.style.display = 'block';
            initializeGame();
        } else {
            alert('Please enter a username to start the game.');
        }
    });

    function initializeGame() {
        // Initialize game logic and UI
        const game = new Game(playerScores);
        game.start();
        updateScoreDisplay();
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `Player 1: ${playerScores.player1} - Player 2: ${playerScores.player2}`;
    }

    // Additional event listeners and functions can be added here
});