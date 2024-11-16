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

export function dealCardInUI(handName, card, cardPosition) {
  console.log("cardPosition in dealCardInUI", cardPosition);
  if (handName === "playerHandOne") {
    const cardHTML = generateCardHTML(card, cardPosition);
    // Add transition here next
    DOMElements.playerHand.innerHTML += cardHTML;
  } else if (handName === "playerHandTwo") {
    const cardHTML = generateCardHTML(card, cardPosition);
    DOMElements.playerHand.innerHTML += cardHTML;
  } else if (handName === "dealerHand") {
    const cardHTML = generateCardHTML(card, cardPosition);
    DOMElements.dealerHand.innerHTML += cardHTML;
  }
}

export function generateCardHTML(card, cardPosition) {
  const cardPositionAdjustment = cardPosition * 1;

  if (card.suit === "♠" || card.suit === "♣") {
    const cardHTML = `
       <div class="card card-black-suit " style="transform: translateX(${cardPositionAdjustment}em)">
         <div class="card-suit card-suit-left">
         <p>${card.suit}</p>
         <p>${card.rank}</p>
         </div>
         <div class="card-rank">${card.rank}</div>
         <div class="card-suit card-suit-right">
         <p>${card.suit}</p>
         <p>${card.rank}</p>
         </div>
       </div>
     `;
    return cardHTML;
  } else {
    const cardHTML = `
       <div class="card card-red-suit" style="transform: translateX(${cardPositionAdjustment}em)">
         <div class="card-suit card-suit-left">
         <p>${card.suit}</p>
         <p>${card.rank}</p>
         </div>
         <div class="card-rank">${card.rank}</div>
         <div class="card-suit card-suit-right">
         <p>${card.suit}</p>
         <p>${card.rank}</p>
         
         </div>
       </div>
     `;
    return cardHTML;
  }
}

export function updateScoreDisplay(GameState) {
  const playerScoreElement = DOMElements.playerScore;
  const dealerScoreElement = DOMElements.dealerScore;

  playerScoreElement.textContent = GameState.playerScore;
  dealerScoreElement.textContent = GameState.dealerScore;
  console.log(
    "GameState.playerScore in updateScoreDisplay",
    GameState.playerScore
  );
}
