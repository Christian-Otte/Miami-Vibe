const score = {
    player1: {
        name: '',
        score: 0
    },
    player2: {
        name: '',
        score: 0
    },
    setPlayerNames: function(name1, name2) {
        this.player1.name = name1;
        this.player2.name = name2;
    },
    updateScore: function(winner) {
        if (winner === 'player1') {
            this.player1.score += 1;
        } else if (winner === 'player2') {
            this.player2.score += 1;
        }
    },
    resetScore: function() {
        this.player1.score = 0;
        this.player2.score = 0;
    },
    getScore: function() {
        return {
            player1: this.player1.score,
            player2: this.player2.score
        };
    }
};

// Remove export for browser compatibility