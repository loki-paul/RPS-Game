document.addEventListener("DOMContentLoaded", () => {
    const resultDisplay = document.getElementById("result");
    const scoreDisplay = document.getElementById("score");
    const player1ChoiceImg = document.getElementById("player1-choice");
    const player2ChoiceImg = document.getElementById("player2-choice");
    const timerDisplay = document.getElementById("timer");
    const playAgainModal = document.getElementById("play-again-modal");
  
    let player1Score = 0;
    let player2Score = 0;
    let draws = 0;
    let rounds = 0;
    const maxRounds = 5;
    let timer;
    let countdown = 3;
    let gameActive = false; // To track if the game is active
  
    // New variables for mode and two-player choices
    let gameMode = "1player"; // possible values: "1player", "2player"
    let player1Choice = null;
    let player2Choice = null;
  
    // Start Game button event
    document.getElementById("start-btn").addEventListener("click", startGame);
  
    // Mode Toggle button event
    document.getElementById("mode-toggle").addEventListener("click", () => {
      if (gameMode === "1player") {
        gameMode = "2player";
        document.getElementById("mode-toggle").innerText = "Mode: 2 Player";
        document.getElementById("player2-title").innerText = "Player 2";
      } else {
        gameMode = "1player";
        document.getElementById("mode-toggle").innerText = "Mode: 1 Player";
        document.getElementById("player2-title").innerText = "Computer";
      }
    });
  
    // Reset Button event
    document.getElementById("reset-btn").addEventListener("click", resetGame);
  
    function startGame() {
      rounds = 0;
      player1Score = 0;
      player2Score = 0;
      draws = 0;
      player1Choice = null;
      player2Choice = null;
      updateScore();
      resetChoices();
      startCountdown();
      resultDisplay.innerText = "Who will win?";
      gameActive = true;
    }
  
    function startCountdown() {
      clearInterval(timer);
      countdown = 3;
      timerDisplay.innerText = `Timer: ${countdown}`;
      timer = setInterval(() => {
        countdown--;
        timerDisplay.innerText = `Timer: ${countdown}`;
        if (countdown === 0) {
          clearInterval(timer);
        }
      }, 1000);
    }
  
    window.handleChoice = (choice, player) => {
      if (!gameActive || rounds >= maxRounds) return;
  
      if (gameMode === "1player") {
        // In 1-player mode, only process Player 1's input.
        if (player === 1) {
          player1ChoiceImg.src = `assets/images/${choice.toLowerCase()}.png`;
          let aiChoice = getAIChoice();
          player2ChoiceImg.src = `assets/images/${aiChoice.toLowerCase()}.png`;
          determineWinner(choice, aiChoice);
          rounds++;
          if (rounds >= maxRounds) {
            setTimeout(() => announceWinner(), 1000);
            gameActive = false;
          }
        }
      } else {
        // In 2-player mode, delay showing Player 1's move until Player 2 has chosen.
        if (player === 1) {
          player1Choice = choice;
          // Do not update player1ChoiceImg yet
        } else if (player === 2) {
          player2Choice = choice;
          // We update player2's image immediately if you want feedback for player2
          player2ChoiceImg.src = `assets/images/${choice.toLowerCase()}.png`;
        }
        // Once both players have made a choice, update both images and determine the winner.
        if (player1Choice && player2Choice) {
          player1ChoiceImg.src = `assets/images/${player1Choice.toLowerCase()}.png`;
          player2ChoiceImg.src = `assets/images/${player2Choice.toLowerCase()}.png`;
          determineWinner(player1Choice, player2Choice);
          rounds++;
          setTimeout(() => {
            // Reset choices for next round.
            resetChoices();
            player1Choice = null;
            player2Choice = null;
            if (rounds < maxRounds) {
              startCountdown();
            } else {
              announceWinner();
              gameActive = false;
            }
          }, 1000);
        }
      }
    };
  
    function getAIChoice() {
      const choices = ["Rock", "Paper", "Scissors"];
      return choices[Math.floor(Math.random() * choices.length)];
    }
  
    function determineWinner(choice1, choice2) {
      if (choice1 === choice2) {
        draws++;
        resultDisplay.innerText = "It's a Draw!";
      } else if (
        (choice1 === "Rock" && choice2 === "Scissors") ||
        (choice1 === "Paper" && choice2 === "Rock") ||
        (choice1 === "Scissors" && choice2 === "Paper")
      ) {
        player1Score++;
        resultDisplay.innerText =
          gameMode === "1player" ? "Player 1 Wins!" : "Player 1 Wins!";
      } else {
        player2Score++;
        resultDisplay.innerText =
          gameMode === "1player" ? "Computer Wins!" : "Player 2 Wins!";
      }
      updateScore();
    }
  
    function announceWinner() {
      let finalMessage = "";
      if (player1Score > player2Score) {
        finalMessage = gameMode === "1player" ? "Congratulations! You Win! Play Again?" : "Player 1 Wins! Play Again?";
      } else if (player2Score > player1Score) {
        finalMessage = gameMode === "1player" ? "Sorry! Computer Wins! Play Again?" : "Player 2 Wins! Play Again?";
      } else {
        finalMessage = "It's a Draw! Play Again?";
      }
      document.querySelector("#play-again-content p").innerText = finalMessage;
      showConfetti();
      setTimeout(() => {
        playAgainModal.style.display = "flex";
      }, 1500);
    }
  
    document.getElementById("yes-btn").addEventListener("click", () => {
      resetGame();
      playAgainModal.style.display = "none";
    });
  
    document.getElementById("no-btn").addEventListener("click", () => {
      playAgainModal.style.display = "none";
    });
  
    function showConfetti() {
      const duration = 2000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 9999,
      };
  
      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }
  
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        );
      }, 250);
    }
  
    function updateScore() {
      scoreDisplay.innerText = `You: ${player1Score} | Opponent: ${player2Score} | Draws: ${draws}`;
    }
  
    function resetGame() {
      rounds = 0;
      player1Score = 0;
      player2Score = 0;
      draws = 0;
      player1Choice = null;
      player2Choice = null;
      updateScore();
      resultDisplay.innerText = "Who will win?";
      resetChoices();
      startCountdown();
      gameActive = true;
    }
  
    function resetChoices() {
      player1ChoiceImg.src = "";
      player2ChoiceImg.src = "";
    }
  });
  
