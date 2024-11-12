// ui.js
// ui.js
export const DOMElements = {
  initialWagerView: document.getElementById("initial-wager"),
  gameBoardView: document.getElementById("game-board"),

  wagerInput: document.getElementById("wager-input"),
  playerHandContainer: document.getElementById("player-hand"),
  dealerHandContainer: document.getElementById("dealer-hand"),
  bankrollDisplay: document.getElementById("bankroll"),
  messageDisplay: document.getElementById("message"),
  // Add more elements as needed
  // Lazy Load
  get wagerForm() {
    return document.getElementById("wager-form");
  },
};

export function toggleView() {
  if (DOMElements.gameBoardView.classList.contains("hidden")) {
    DOMElements.gameBoardView.classList.remove("hidden");
    DOMElements.initialWagerView.classList.add("hidden");
  } else {
    DOMElements.gameBoardView.classList.add("hidden");
    DOMElements.initialWagerView.classList.remove("hidden");
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
  const wagerInputElement = document.getElementById("wager-input");
  const wagerValue = parseInt(wagerInputElement.value, 10) || 100;
  return isNaN(wagerValue) ? 0 : wagerValue; // Basic check to return 0 if input is invalid
}
