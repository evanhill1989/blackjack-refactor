import { GameState, notifyObservers, updateGameState } from "./state.js";

import { toggleSplitHands } from "./gameLogic.js";

export const DOMElements = {
  mainElement: document.querySelector("main"),
  actionsDiv: document.querySelector(".in-hand-actions"),

  initialWagerView: document.getElementById("initial-wager"),
  gameBoardView: document.getElementById("game-board"),

  wagerInput: document.getElementById("wager-input"),
  focusHand: document.getElementById("focus-hand"),
  dealerHand: document.getElementById("dealer-hand"),
  previewHand: document.getElementById("preview-hand"),

  wagerDisplay: document.getElementById("wager_amount"),
  bankrollDisplay: document.getElementById("bankroll"),
  bankrollTabDisplay: document.getElementById("bankroll_tab"),
  outcomeMessageDisplay: document.getElementById("message"),

  splitBtn: document.getElementById("split-btn"),
  doubleBtn: document.getElementById("double-btn"),
  hitBtn: document.getElementById("hit-btn"),
  standBtn: document.getElementById("stand-btn"),

  // Add more elements as needed
  // Lazy Load

  dealerScore: document.getElementById("dealer-score"),
  focusScore: document.getElementById("focus-score"),
  previewScore: document.getElementById("preview-score"),
};

export function resetUI() {
  DOMElements.focusHand.innerHTML = "";
  DOMElements.dealerHand.innerHTML = "";
  DOMElements.previewHand.innerHTML = "";
}

export function toggleView() {
  if (GameState.view === "wager") {
    DOMElements.gameBoardView.classList.add("hidden");
    DOMElements.initialWagerView.classList.remove("hidden");
  } else if (GameState.view === "game-board") {
    DOMElements.gameBoardView.classList.remove("hidden");
    DOMElements.initialWagerView.classList.add("hidden");
  }
}

export function updateBankrollDisplay() {
  DOMElements.bankrollDisplay.textContent = GameState.bankroll;
  DOMElements.bankrollTabDisplay.textContent = GameState.bankroll;
}

export function getWagerInput() {
  const wagerInputElement = document.getElementById("wager-input");
  const wagerValue = parseInt(wagerInputElement.value, 10) || 100;
  return isNaN(wagerValue) ? 0 : wagerValue; // Basic check to return 0 if input is invalid
}

export async function dealCardInUI(handName, card) {
  // This is where strange style things will start probably
  // TODO define the hand more simply using dynamic computation on object
  let hand;
  if (handName === "userFirst") {
    hand = GameState.hands.userFirst.cards;
  } else if (handName === "userSecond") {
    hand = GameState.hands.userSecond.cards;
  } else if (handName === "dealer") {
    hand = GameState.hands.dealer.cards;
  } else {
    console.error("Invalid hand name");
  }

  const cardPosition = hand.length - 1;
  const cardPositionAdjustment = cardPosition * 1;

  const cardHTML = generateCardHTML(card, cardPosition);

  const cardDiv = generateCardDiv(cardPositionAdjustment);

  cardDiv.classList.add("card-div");

  cardDiv.innerHTML = cardHTML;
  // Determine the hand container based on `handName`

  if (handName === "userFirst" || handName === "userSecond") {
    DOMElements.focusHand.appendChild(cardDiv);
  } else if (handName === "dealer") {
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
export function updateScoresDisplay() {
  const focusScoreElement = DOMElements.focusScore;
  const previewScoreElement = DOMElements.previewScore;
  const dealerScoreElement = DOMElements.dealerScore;

  focusScoreElement.textContent = GameState.hands.focusHand.score || "";
  previewScoreElement.textContent = GameState.hands.previewHand.score || "";
  if (GameState.dealerHoleCardExposed === true) {
    dealerScoreElement.textContent = GameState.hands.dealer.score;
  }
}

export function outcomeAnnouncement() {
  // this can be refactored below

  const outcome =
    GameState.hands.focus === "userFirst"
      ? GameState.hands.userFirst.outcome
      : GameState.hands.userSecond.outcome;

  if (
    outcome === "push" ||
    outcome === "win" ||
    outcome === "lose" ||
    outcome === "bust"
  ) {
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
    clearHandHTML(); // Patch this in for now , but it needs to exist beyond this scope.
  } else if (outcome === null || outcome === undefined) {
    // console.error("Outcome i null or undefined!");
  } else {
  }
}

export function clearHandHTML() {
  DOMElements.focusHand.innerHTML = "";
  DOMElements.dealerHand.innerHTML = "";
  DOMElements.previewHand.innerHTML = "";
}

// DOUBLE THINGS
export function toggleDoubleBtn() {
  if (GameState.canDouble) {
    DOMElements.doubleBtn.disabled = false;
  } else {
    DOMElements.doubleBtn.disabled = true;
  }
}

// SPLIT THINGS

// *observer
export function toggleSplitBtn() {
  if (GameState.canSplit) {
    DOMElements.splitBtn.disabled = false;
  } else {
    DOMElements.splitBtn.disabled = true;
  }
}

export function splitUI() {
  renderSplitHands();
  DOMElements.splitBtn.disabled = true;
  DOMElements.doubleBtn.disabled = true;
}

export function renderFocusHand() {
  const currentFocusHand = GameState.hands.focusHand.cards;
  const newHand = mapOverHand(currentFocusHand);

  DOMElements.focusHand.innerHTML = "";
  DOMElements.focusHand.innerHTML = newHand;
  DOMElements.focusScore.textContent = GameState.hands.focusHand.score || "";
}

export function renderPreviewHand() {
  const previewHand = GameState.hands.previewHand.cards;

  const newHand = mapOverHand(previewHand);
  const previewHandDiv = document.createElement("div");

  DOMElements.previewHand.innerHTML = "";
  previewHandDiv.innerHTML = newHand;

  DOMElements.previewHand.appendChild(previewHandDiv);

  DOMElements.previewScore.textContent =
    GameState.hands.previewHand.score || "";
}

export function renderSplitHands() {
  if (GameState.isSplit || GameState.isDouble) {
    renderFocusHand();
    renderPreviewHand();
  }
}

export function togglePreviewFocusDisplay(toggleToFocus, toggleToPreview) {
  if (toggleToFocus) {
    GameState.hands.focus = toggleToFocus;
    GameState.hands.preview = toggleToPreview || null;
    notifyObservers(); // meh, a bit jank
    renderFocusHand();
    renderPreviewHand();
  } else {
    renderFocusHand();
    renderPreviewHand();
  }

  //updateScoresDisplay(); // does this run without calling this function- because updateScores is triggered?
}

export function mapOverHand(hand) {
  const newHandHTMLArr = [];

  hand.map((card, index) => {
    const cardHTML = generateCardHTML(card).replace(/\n/g, "").trim();

    newHandHTMLArr.push(cardHTML);
  });
  return newHandHTMLArr;
}

export function flipDealerHoleCardUp() {
  // DOMElements.dealerHoleCard.classList.remove("hidden");
  // DOMElements.dealerHoleCard.classList.add("visible");
}

// UTILITY ui funcs

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
