let timerElement = document.querySelector(".timer");
let startButton = document.querySelector(".start");
let countdown;
let time = 25 * 60;

function updateTimer() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  timerElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

startButton.addEventListener("click", () => {
  clearInterval(countdown);
  time = 25 * 60;
  countdown = setInterval(() => {
    if (time > 0) {
      time--;
      updateTimer();
    } else {
      clearInterval(countdown);
      alert("Sessão finalizada!");
    }
  }, 1000);
});


