// Miami Vibe Tic Tac Toe Main JS
const welcomePage = document.getElementById('welcome');
const gamePage = document.getElementById('game');
const scoresPage = document.getElementById('scores');
const startBtn = document.getElementById('startBtn');
const backBtn = document.getElementById('backBtn');
const closeScoresBtn = document.getElementById('closeScoresBtn');
const usernameInput = document.getElementById('username');
const playerLabel = document.getElementById('playerLabel');
const boardDiv = document.getElementById('board');
const scoreList = document.getElementById('scoreList');

let username = '';
let currentPlayer = 'X';
let board = Array(9).fill('');
let scores = [];

function showPage(page) {
    welcomePage.style.display = 'none';
    gamePage.style.display = 'none';
    scoresPage.style.display = 'none';
    page.style.display = 'block';
}

function startGame() {
    username = usernameInput.value.trim() || 'Player';
    currentPlayer = 'X';
    board = Array(9).fill('');
    renderBoard();
    playerLabel.textContent = `${username} (X) vs Opponent (O)`;
    showPage(gamePage);
}

function renderBoard() {
    boardDiv.innerHTML = '';
    board.forEach((val, idx) => {
        const sq = document.createElement('div');
        sq.className = 'square';
        sq.textContent = val;
        sq.onclick = () => handleMove(idx);
        boardDiv.appendChild(sq);
    });
}

function handleMove(idx) {
    if (board[idx] !== '') return;
    board[idx] = currentPlayer;
    renderBoard();
    if (checkWin(currentPlayer)) {
        scores.push({ user: username, winner: currentPlayer });
        alert(`${currentPlayer} wins!`);
        showScores();
    } else if (board.every(cell => cell !== '')) {
        scores.push({ user: username, winner: 'Draw' });
        alert('Draw!');
        showScores();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkWin(player) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return wins.some(line => line.every(i => board[i] === player));
}

function showScores() {
    scoreList.innerHTML = scores.map(s => `<li>${s.user}: ${s.winner}</li>`).join('');
    showPage(scoresPage);
}

startBtn.onclick = startGame;
backBtn.onclick = () => showPage(welcomePage);
closeScoresBtn.onclick = () => showPage(welcomePage);

showPage(welcomePage);