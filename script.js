const initialWagerView = document.getElementById("initial-wager");
const gameBoardView = document.getElementById("game-board");

function dealNewHand(event) {
  event.preventDefault();

  toggleView();
}

function toggleView() {
  if (gameBoardView.classList.contains("hidden")) {
    gameBoardView.classList.remove("hidden");
    initialWagerView.classList.add("hidden");
  } else {
    gameBoardView.classList.add("hidden");
    initialWagerView.classList.remove("hidden");
  }
}

function getWager() {
  const form = event.target; // Get the form element
  const wagerInputValue = form.querySelector("#wager-input").value; // Get the input value
}
