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

    // In-memory scoreboard
    let scoreboardTable = [];

    // Use localStorage for scoreboard persistence
    function loadScoreboardTable() {
        const saved = localStorage.getItem('scoreboardTable');
        if (saved) {
            try {
                scoreboardTable = JSON.parse(saved);
            } catch (e) {
                scoreboardTable = [];
            }
        }
    }
    function saveScoreboardTable() {
        localStorage.setItem('scoreboardTable', JSON.stringify(scoreboardTable));
    }

    // Render scoreboard table directly in welcome screen
    const welcomeScoreboardTableBody = document.createElement('tbody');
    function renderScoreboardTableWelcome() {
        // Ensure the table is in the DOM
        if (!welcomeScoreboardTable.parentNode) {
            document.querySelector('.welcome-screen').appendChild(welcomeScoreboardTable);
        }
        // If there are no scores, show a message
        if (!scoreboardTable.length) {
            welcomeScoreboardTableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#ff2fd6;">No games played yet.</td></tr>';
        } else {
            welcomeScoreboardTableBody.innerHTML = scoreboardTable.map(row => `
                <tr>
                    <td>${row.player1}</td>
                    <td>${row.player2}</td>
                    <td>${row.mode}</td>
                    <td>${row.difficulty}</td>
                    <td>${row.size}x${row.size}</td>
                    <td>${row.winner}</td>
                    <td>${row.score1}</td>
                    <td>${row.score2}</td>
                </tr>
            `).join('');
        }
    }

    // Insert scoreboard table into welcome screen
    const welcomeScoreboardTable = document.createElement('table');
    welcomeScoreboardTable.style.width = '100%';
    welcomeScoreboardTable.style.color = '#fff';
    welcomeScoreboardTable.style.borderCollapse = 'collapse';
    welcomeScoreboardTable.innerHTML = `
        <thead>
            <tr style="background:#ff2fd6; color:#fff;">
                <th>Player 1</th>
                <th>Player 2</th>
                <th>Mode</th>
                <th>Difficulty</th>
                <th>Size</th>
                <th>Winner</th>
                <th>Score 1</th>
                <th>Score 2</th>
            </tr>
        </thead>
    `;
    welcomeScoreboardTable.appendChild(welcomeScoreboardTableBody);

    // Remove direct scoreboard table from welcome screen if present
    if (welcomeScoreboardTable && welcomeScoreboardTable.parentNode) {
        welcomeScoreboardTable.parentNode.removeChild(welcomeScoreboardTable);
    }

    // Show scoreboard modal
    const showScoreboardBtn = document.getElementById('show-scoreboard');
    const scoreboardModal = document.getElementById('scoreboard-modal');
    const closeScoreboardBtn = document.getElementById('close-scoreboard');
    const scoreboardTableBody = document.querySelector('#scoreboard-table tbody');

    function renderScoreboardTable() {
        scoreboardTableBody.innerHTML = scoreboardTable.slice().reverse().map(row => `
            <tr>
                <td>${row.player1}</td>
                <td>${row.player2}</td>
                <td>${row.mode}</td>
                <td>${row.difficulty}</td>
                <td>${row.size}x${row.size}</td>
                <td>${row.winner}</td>
                <td>${row.score1}</td>
                <td>${row.score2}</td>
            </tr>
        `).join('');
    }

    // Add reset scoreboard button functionality
    const resetScoreboardBtn = document.createElement('button');
    resetScoreboardBtn.id = 'reset-scoreboard';
    resetScoreboardBtn.textContent = 'Reset Scoreboard';
    resetScoreboardBtn.style.marginTop = '12px';
    document.getElementById('scoreboard-modal').querySelector('div').appendChild(resetScoreboardBtn);
    resetScoreboardBtn.onclick = () => {
        scoreboardTable = [];
        saveScoreboardTable();
        renderScoreboardTable();
    };

    showScoreboardBtn.onclick = () => {
        renderScoreboardTable();
        scoreboardModal.style.display = 'flex';
    };
    closeScoreboardBtn.onclick = () => {
        scoreboardModal.style.display = 'none';
    };

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
    const botDifficultySelect = document.getElementById('bot-difficulty');
    const botDifficultyLabel = document.getElementById('bot-difficulty-label');
    const player2Row = document.getElementById('player2-row');
    if (playerModeSelect) {
        playerModeSelect.style.display = '';
        playerMode = parseInt(playerModeSelect.value, 10);
        playerModeSelect.addEventListener('change', () => {
            playerMode = parseInt(playerModeSelect.value, 10);
            if (playerMode === 1) {
                botDifficultySelect.style.display = '';
                botDifficultyLabel.style.display = '';
                player2Input.style.display = 'none';
            } else {
                botDifficultySelect.style.display = 'none';
                botDifficultyLabel.style.display = 'none';
                player2Input.style.display = '';
            }
        });
        // Initial display
        if (playerMode === 1) {
            botDifficultySelect.style.display = '';
            botDifficultyLabel.style.display = '';
            player2Input.style.display = 'none';
        } else {
            botDifficultySelect.style.display = 'none';
            botDifficultyLabel.style.display = 'none';
            player2Input.style.display = '';
        }
    }

    // Show player 2 name input in two player mode
    if (playerModeSelect && player2Row) {
        function updatePlayer2Visibility() {
            if (parseInt(playerModeSelect.value, 10) === 2) {
                player2Row.style.display = '';
            } else {
                player2Row.style.display = 'none';
            }
        }
        playerModeSelect.addEventListener('change', updatePlayer2Visibility);
        updatePlayer2Visibility();
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
        // Scoreboard logic
        let winner;
        let score1 = 0;
        let score2 = 0;
        if (result.result === 'Draw') {
            winner = 'Draw';
        } else if (result.result.includes('wins!')) {
            // Extract winner and loser from result string
            const winnerMatch = result.result.match(/^(.*?) \(\+1\) vs (.*?) \(\+0\): (.*?) wins!/);
            if (winnerMatch) {
                winner = winnerMatch[1];
                if (winner === result.player1) {
                    score1 = 1;
                    score2 = 0;
                } else {
                    score1 = 0;
                    score2 = 1;
                }
            } else {
                winner = result.player1;
                score1 = 1;
                score2 = 0;
            }
        }
        scoreboardTable.push({
            player1: result.player1,
            player2: result.player2,
            mode: lastPlayerMode === 1 ? 'Single' : 'Two',
            difficulty: botDifficulty,
            size: gridSize,
            winner,
            score1,
            score2
        });
        saveScoreboardTable();
        renderScoreboardTable();
        gameScreen.style.display = 'none';
        const winnerScreen = document.querySelector('.winner-screen');
        winnerScreen.style.display = '';
        if (result.result === 'Draw') {
            document.getElementById('winner-message').textContent = 'It\'s a draw!';
        } else if (winner) {
            document.getElementById('winner-message').textContent = `${winner} wins!`;
        } else {
            document.getElementById('winner-message').textContent = result.result;
        }
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
        stopMusic();
    }

    let botDifficulty = 'easy';
    if (botDifficultySelect) {
        botDifficulty = botDifficultySelect.value;
        botDifficultySelect.addEventListener('change', () => {
            botDifficulty = botDifficultySelect.value;
        });
    }

    const gridSizeSelect = document.getElementById('grid-size');
    let gridSize = parseInt(gridSizeSelect.value, 10);
    gridSizeSelect.addEventListener('change', () => {
        gridSize = parseInt(gridSizeSelect.value, 10);
    });

    // Background music controls
    const backgroundMusic = document.getElementById('background-music');
    function playMusic() {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
    }
    function stopMusic() {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }

    // Play background music on welcome page load
    playMusic();

    // Ensure music plays after first user interaction (for browser autoplay restrictions)
    document.querySelector('.welcome-screen').addEventListener('click', () => {
        if (backgroundMusic.paused) {
            playMusic();
        }
    });
    document.querySelector('.welcome-screen').addEventListener('keydown', () => {
        if (backgroundMusic.paused) {
            playMusic();
        }
    });

    // Start game button
    startButton.addEventListener('click', () => {
        playerNames.player1 = player1Input.value.trim() || 'Player 1';
        playerNames.player2 = player2Input.value.trim() || (playerMode === 1 ? 'Bot' : 'Player 2');
        lastPlayerMode = playerMode;
        welcomeScreen.style.display = 'none';
        gameScreen.style.display = '';
        playMusic();
        window.startTicTacToeGame(playerNames, playerMode, scoreboard, handleGameEnd, botDifficulty, gridSize);
    });

    // Load and render scoreboard on page load and when returning to main
    function showWelcomeScreen() {
        document.querySelector('.game-screen').style.display = 'none';
        document.querySelector('.winner-screen').style.display = 'none';
        document.querySelector('.welcome-screen').style.display = '';
        loadScoreboardTable();
        renderScoreboardTableWelcome();
        renderScoreboard();
    }
    document.getElementById('return-main').onclick = showWelcomeScreen;

    // Load and render scoreboard on page load
    loadScoreboardTable();
    renderScoreboardTableWelcome();
    renderScoreboard();
});