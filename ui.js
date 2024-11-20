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
  previewHand: document.getElementById("preview-hand"),

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
  console.log(cardHTML, "cardHTML in dealCardInUI");
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
    const cardHTML = `<div class="card card-black">
    <div class="card-suit card-suit-left"><p>${card.suit}</p><p>${card.rank}</p></div>
    <div class="card-rank">${card.rank}</div>
    <div class="card-suit card-suit-right"><p>${card.suit}</p><p>${card.rank}</p></div>
  </div>`;
    return cardHTML;
  } else {
    const cardHTML = `<div class="card card-red">
    <div class="card-suit card-suit-left"><p>${card.suit}</p><p>${card.rank}</p></div>
    <div class="card-rank">${card.rank}</div>
    <div class="card-suit card-suit-right"><p>${card.suit}</p><p>${card.rank}</p></div>
  </div>`;
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

export function splitUI(GameState) {
  toggleVisibility(DOMElements.previewHand);
  setFocusHand(GameState);
  setPreviewHand(GameState);
}

export function setFocusHand(GameState) {
  const focusHand = GameState.focusHand;
  DOMElements.playerHand.innerHTML = "";
  const newHandHTML = mapOverHand(focusHand, GameState);
  console.log(newHandHTML, "newHandHTML in setFocusHand");
  newHandHTML.map((card, index) => {
    DOMElements.playerHand.innerHTML += card;
  });
}

export function setPreviewHand(GameState) {
  const previewHand = GameState.previewHand;
  const newHand = mapOverHand(previewHand, GameState);

  DOMElements.previewHand.innerHTML = newHand;
}

export function mapOverHand(hand, GameState) {
  const newHandObj =
    hand === "playerHandOne"
      ? GameState.playerHandOne
      : GameState.playerHandTwo;
  const newHandHTMLArr = [];

  newHandObj.map((card, index) => {
    const cardHTML = generateCardHTML(card).replace(/\n/g, "").trim();

    newHandHTMLArr.push(cardHTML);
  });
  return newHandHTMLArr;
}

export function removeSecondCard() {
  const element = DOMElements.playerHand;
  return element.removeChild(element.lastChild);
}

export function generatePreviewCardHTML(card) {
  if (card.suit === "♠" || card.suit === "♣") {
    const previewCardHTML = `
           <div class="preview-card card-black">
           <p>${card.suit}</p>
                  <p>${card.rank}</p>
                  <p>${card.suit}</p>
           </div>
         `;
    return previewCardHTML;
  } else {
    const previewCardHTML = `
           <div class="preview-card card-red">
                  <p>${card.suit}</p>
                  <p>${card.rank}</p>
                  <p>${card.suit}</p>
           </div>
         `;
    return previewCardHTML;
  }
}

export function toggleVisibility(element) {
  if (element.classList.contains("hidden")) {
    element.classList.remove("hidden");
    element.classList.add("visible");
  } else {
    element.classList.add("hidden");
    element.classList.remove("visible");
  }
}

export function toggleClass(element, removedClass, addedClass) {
  element.classList.remove(removedClass);
  element.classList.add(addedClass);
}

export function togglePreviewHand() {}

export function resetUI() {
  DOMElements.playerHand.innerHTML = "";
  DOMElements.dealerHand.innerHTML = "";
}
