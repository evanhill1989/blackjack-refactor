export const DOMElements = {
  mainElement: document.querySelector("main"),

  initialWagerView: document.getElementById("initial-wager"),
  gameBoardView: document.getElementById("game-board"),

  wagerInput: document.getElementById("wager-input"),
  playerHand: document.getElementById("player-hand"),
  dealerHand: document.getElementById("dealer-hand"),
  bankrollDisplay: document.getElementById("bankroll"),
  bankrollTabDisplay: document.getElementById("bankroll_tab"),
  outcomeMessageDisplay: document.getElementById("message"),
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
  DOMElements.bankrollDisplay.textContent = bankroll;
  DOMElements.bankrollTabDisplay.textContent = bankroll;
}
// export function toggleView(view) {
//   /*...*/
// }

export function getWagerInput() {
  const wagerInputElement = document.getElementById("wager-input");
  const wagerValue = parseInt(wagerInputElement.value, 10) || 100;
  return isNaN(wagerValue) ? 0 : wagerValue; // Basic check to return 0 if input is invalid
}

export async function dealCardInUI(handName, card, cardPosition) {
  const cardPositionAdjustment = cardPosition * 1;

  const cardDiv = generateCardDiv(cardPositionAdjustment);

  cardDiv.classList.add("card-div");

  const cardHTML = generateCardHTML(card, cardPosition);

  cardDiv.innerHTML = cardHTML;
  // Determine the hand container based on `handName`

  if (handName === "playerHandOne") {
    DOMElements.playerHand.appendChild(cardDiv);
  } else if (handName === "playerHandTwo") {
    DOMElements.playerHand.appendChild(cardDiv); // Update if you have a separate container for second hand
  } else if (handName === "dealerHand") {
    DOMElements.dealerHand.appendChild(cardDiv);
  } else {
    console.error("Invalid hand name:", handName);
    return;
  }

  // Create a new card element

  // Append the card with a delay

  // Optionally add an animation class

  requestAnimationFrame(() => {
    cardDiv.classList.add("animate");
  });

  // Remove the animation class after it's done (if needed)
  //   setTimeout(() => cardElement.classList.remove("deal-animation"), 1000); // Adjust timing to match your CSS
}

export function generateCardDiv(cardPositionAdjustment) {
  const cardDiv = document.createElement("div");
  cardDiv.style.left = `${cardPositionAdjustment}em`;
  return cardDiv;
}

export function generateCardHTML(card) {
  if (card.suit === "♠" || card.suit === "♣") {
    const cardHTML = `
         <div class="card card-black">
           <div class="card-suit  card-suit-left">
                <p>${card.suit}</p>
                <p>${card.rank}</p>
            </div>
            <div class="card-rank">${card.rank}</div>
            <div class="card-suit  card-suit-right">
                <p>${card.suit}</p>
                <p>${card.rank}</p>
           </div>
         </div>
         
       `;
    return cardHTML;
  } else {
    const cardHTML = `
         <div class="card card-red">
           <div class="card-suit  card-suit-left">
                <p>${card.suit}</p>
                <p>${card.rank}</p>
            </div>
            <div class="card-rank">${card.rank}</div>
            <div class="card-suit   card-suit-right">
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

  let focusHand = GameState.focusHand;

  if (focusHand === "playerHandOne") {
    playerScoreElement.textContent = GameState.playerHandOneScore;
  } else if (focusHand === "playerHandTwo") {
    playerScoreElement.textContent = GameState.playerHandTwoScore;
  }

  dealerScoreElement.textContent = GameState.dealerScore;
}

export function outcomeAnnouncement(outcome) {
  console.log(outcome, "outcome in outcomeAnnouncement function");
  const tempDiv = document.createElement("div");
  const outcomeHTML = `
    <div class="outcome-message">
      <p>${outcome.toUpperCase()}</p>
    </div>
  `;
  tempDiv.innerHTML = outcomeHTML;
  DOMElements.mainElement.appendChild(tempDiv);
  setTimeout(() => {
    DOMElements.mainElement.removeChild(tempDiv);
  }, 2000);
}

export function resetUI() {
  console.log("resetUI");
}
