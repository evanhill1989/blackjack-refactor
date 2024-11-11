// ui.js
// ui.js
export const DOMElements = {
  initialWagerView: document.getElementById("initial-wager"),
  gameBoardView: document.getElementById("game-board"),
  wagerForm: document.getElementById("wagerForm"),
  wagerInput: document.getElementById("wagerInput"),
  playerHandContainer: document.getElementById("playerHand"),
  dealerHandContainer: document.getElementById("dealerHand"),
  bankrollDisplay: document.getElementById("bankroll"),
  messageDisplay: document.getElementById("message"),
  // Add more elements as needed
};

export function toggleView() {
  if (gameBoardView.classList.contains("hidden")) {
    gameBoardView.classList.remove("hidden");
    initialWagerView.classList.add("hidden");
  } else {
    gameBoardView.classList.add("hidden");
    initialWagerView.classList.remove("hidden");
  }
}

export function renderCardInUI(hand, card) {
  /*...*/
}
export function updateBankrollDisplay(bankroll) {
  /*...*/
}
// export function toggleView(view) {
//   /*...*/
// }

// ui.js
export function getWagerInput() {
  const wagerInputElement = document.getElementById("wagerInput");
  const wagerValue = parseInt(wagerInputElement.value, 10);
  return isNaN(wagerValue) ? 0 : wagerValue; // Basic check to return 0 if input is invalid
}
