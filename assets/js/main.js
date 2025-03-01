document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    const resetBtn = document.getElementById("reset-btn");
    const modeToggle = document.getElementById("mode-toggle");
    const difficultySelect = document.getElementById("difficulty");
    const timerDisplay = document.getElementById("timer");
    const resultDisplay = document.getElementById("result");
    const scoreDisplay = document.getElementById("score");
    const player1ChoiceImg = document.getElementById("player1-choice");
    const player2ChoiceImg = document.getElementById("player2-choice");
    const player2Title = document.getElementById("player2-title");
    const player2Choices = document.getElementById("player2-choices");

    let mode = "1 Player";
    let difficulty = "normal";
    let round = 0;
    let maxRounds = 3;
    let player1Score = 0;
    let player2Score = 0;
    let draws = 0;
    let gameStarted = false;
    let player1Selection = null;
    let player2Selection = null;

    // Mode Toggle (1 Player or 2 Players)
    modeToggle.addEventListener("click", () => {
        if (gameStarted) return;
        mode = mode === "1 Player" ? "2 Player" : "1 Player";
        modeToggle.innerText = `Mode: ${mode}`;
        player2Title.innerText = mode === "1 Player" ? "Computer" : "Player 2";
        player2Choices.style.display = mode === "2 Player" ? "block" : "none";

        // Disable difficulty selection in 2 Player mode
        difficultySelect.disabled = mode === "2 Player";
    });

    // Difficulty Selection (Easy, Normal, Hard)
    difficultySelect.addEventListener("change", (e) => {
        if (!gameStarted) difficulty = e.target.value;
    });

    // Start Game with Countdown
    startBtn.addEventListener("click", () => {
        if (gameStarted) return;
        gameStarted = true;
        round = 0;
        player1Score = 0;
        player2Score = 0;
        draws = 0;
        updateScore();

        let countdown = 3;
        timerDisplay.innerText = `Timer: ${countdown}`;
        let interval = setInterval(() => {
            countdown--;
            timerDisplay.innerText = `Timer: ${countdown}`;
            if (countdown === 0) {
                clearInterval(interval);
                timerDisplay.innerText = "Game Started!";
            }
        }, 1000);
    });

    // Handle Player Choices
    window.handleChoice = (choice, player) => {
        if (!gameStarted || round >= maxRounds) return;

        if (player === 1) {
            player1Selection = choice;
        } else {
            player2Selection = choice;
        }

        if (mode === "1 Player") {
            player2Selection = getAIChoice();
        }

        if (mode === "1 Player" || (mode === "2 Player" && player1Selection && player2Selection)) {
            player1ChoiceImg.src = `assets/images/${player1Selection.toLowerCase()}.png`;
            player2ChoiceImg.src = `assets/images/${player2Selection.toLowerCase()}.png`;
            player1ChoiceImg.classList.add("show");
            player2ChoiceImg.classList.add("show");

            round++;
            checkWinner();
        }
    };

    // AI Choice Based on Difficulty
    function getAIChoice() {
        const choices = ["Rock", "Paper", "Scissors"];
        return choices[Math.floor(Math.random() * choices.length)];
    }

    // Check Winner of Round
    function checkWinner() {
        if (!player1Selection || !player2Selection) return;

        let winner = "";
        if (player1Selection === player2Selection) {
            draws++;
            winner = "It's a Draw!";
        } else if (
            (player1Selection === "Rock" && player2Selection === "Scissors") ||
            (player1Selection === "Paper" && player2Selection === "Rock") ||
            (player1Selection === "Scissors" && player2Selection === "Paper")
        ) {
            player1Score++;
            winner = "Player 1 Wins!";
        } else {
            player2Score++;
            winner = mode === "1 Player" ? "Computer Wins!" : "Player 2 Wins!";
        }

        resultDisplay.innerText = winner;
        updateScore();

        if (round >= maxRounds) {
            announceWinner();
        }

        player1Selection = null;
        player2Selection = null;
    }

    // Update Score Display
    function updateScore() {
        scoreDisplay.innerText = `Player 1: ${player1Score} | Opponent: ${player2Score} | Draws: ${draws}`;
    }

    // Announce Final Winner
    function announceWinner() {
        let finalMessage = "";
        if (player1Score > player2Score) {
            finalMessage = "Player 1 Wins the Game!";
        } else if (player2Score > player1Score) {
            finalMessage = mode === "1 Player" ? "Computer Wins the Game!" : "Player 2 Wins the Game!";
        } else {
            finalMessage = "It's a Tie!";
        }

        resultDisplay.innerText = finalMessage;
        showConfetti();
        gameStarted = false;
    }

    // Confetti Effect
    function showConfetti() {
        const confettiCount = 100;
        for (let i = 0; i < confettiCount; i++) {
            let confetti = document.createElement("div");
            confetti.className = "confetti";
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    // Reset Game
    resetBtn.addEventListener("click", () => {
        gameStarted = false;
        round = 0;
        player1Score = 0;
        player2Score = 0;
        draws = 0;
        resultDisplay.innerText = "Who will win?";
        player1ChoiceImg.src = "";
        player2ChoiceImg.src = "";
        player1ChoiceImg.classList.remove("show");
        player2ChoiceImg.classList.remove("show");
        updateScore();
        timerDisplay.innerText = "Timer: 3";
    });
});
