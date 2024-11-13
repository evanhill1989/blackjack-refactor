// ui.js
// ui.js

export const DOMElements = {
  initialWagerView: document.getElementById("initial-wager"),
  gameBoardView: document.getElementById("game-board"),

  wagerInput: document.getElementById("wager-input"),
  playerHand: document.getElementById("user-hand"),
  dealerHand: document.getElementById("dealer-hand"),
  bankrollDisplay: document.getElementById("bankroll"),
  messageDisplay: document.getElementById("message"),
  // Add more elements as needed
  // Lazy Load
  playerScore: document.getElementById("user-score"),
  dealerScore: document.getElementById("dealer-score"),
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

export function dealCardInUI(hand, card) {
  if (hand === "playerHand") {
    const cardHTML = generateCardHTML(card);
    // Add transition here next
    DOMElements.playerHand.innerHTML += cardHTML;
  } else if (hand === "dealerHand") {
    const cardHTML = generateCardHTML(card);
    DOMElements.dealerHand.innerHTML += cardHTML;
  }
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

export function generateCardHTML(card) {
  console.log(card);
  const cardHTML = `
       <div class="card">
         <div class="card-suit">${card.suit}</div>
         <div class="card-value">${card.value}</div>
       </div>
     `;

  return cardHTML;
}

export function updateScoreDisplay(GameState) {
  const playerScoreElement = DOMElements.playerScore;
  const dealerScoreElement = DOMElements.dealerScore;

  playerScoreElement.textContent = GameState.playerScore;
  dealerScoreElement.textContent = GameState.dealerScore;
}
