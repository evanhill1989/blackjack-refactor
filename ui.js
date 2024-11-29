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

export function toggleView(GameState) {
  if (GameState.view === "wager") {
    DOMElements.gameBoardView.classList.add("hidden");
    DOMElements.initialWagerView.classList.remove("hidden");
  } else if (GameState.view === "game-board") {
    DOMElements.gameBoardView.classList.remove("hidden");
    DOMElements.initialWagerView.classList.add("hidden");
  }
}

export function updateBankrollDisplay(GameState) {
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
  let hand;
  if (handName === "playerHandOne") {
    hand = GameState.playerHandOne;
  } else if (handName === "playerHandTwo") {
    hand = GameState.playerHandTwo;
  } else if (handName === "dealerHand") {
    hand = GameState.dealerHand;
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

  if (handName === "playerHandOne") {
    DOMElements.focusHand.appendChild(cardDiv);
  } else if (handName === "playerHandTwo") {
    DOMElements.focusHand.appendChild(cardDiv); // Update if you have a separate container for second hand
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
export function updateScoresDisplay(GameState) {
  const focusScoreElement = DOMElements.focusScore;
  const previewScoreElement = DOMElements.previewScore;
  const dealerScoreElement = DOMElements.dealerScore;

  focusScoreElement.textContent = GameState.focusScore;
  previewScoreElement.textContent = GameState.previewScore || "";
  dealerScoreElement.textContent = GameState.dealerScore;
  // console.log(
  //   GameState.focusScore,
  //   "$$$$$$$$$$$$ <------ focusScore in updateScoresDisplay"
  // );
  // console.log(
  //   GameState.playerHandOneScore,
  //   "$$$$$$$$$$$$$ <------ playerHandOneScore in updateScoresDisplay"
  // );
}

export function outcomeAnnouncement(GameState) {
  const focusHand = GameState.focusHand;
  let outcome =
    focusHand === "playerHandOne"
      ? GameState.playerHandOneOutcome
      : GameState.playerHandTwoOutcome;

  if (outcome !== "") {
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
  }
}

export function clearHandHTML() {
  DOMElements.focusHand.innerHTML = "";
  DOMElements.dealerHand.innerHTML = "";
  DOMElements.previewHand.innerHTML = "";
}

// SPLIT THINGS

// *observer
export function toggleSplitBtn(GameState) {
  if (GameState.canSplit) {
    DOMElements.splitBtn.disabled = false;
  } else {
    DOMElements.splitBtn.disabled = true;
  }
}

export function splitUI(GameState) {
  setFocusHand(GameState);
  setPreviewHand(GameState);
  DOMElements.splitBtn.disabled = true;
  // toggleVisibility(DOMElements.previewHand);
  const testButton = document.createElement("button");
  testButton.textContent = "Test Button";
  testButton.addEventListener("click", () => {
    toggleSplitHands(GameState);
  });
  DOMElements.actionsDiv.appendChild(testButton);
}

export function splitStandUI(GameState) {}

export function splitStandHandTwo(GameState) {}

export function setFocusHand(GameState) {
  const currentFocus = GameState.focusHand;
  DOMElements.focusHand.innerHTML = "";
  const newHand = mapOverHand(currentFocus, GameState);

  DOMElements.focusHand.innerHTML = newHand;
}

export function setPreviewHand(GameState) {
  const handName = GameState.previewHand;
  DOMElements.previewHand.innerHTML = "";
  const newHand = mapOverHand(handName, GameState);
  const previewHandDiv = document.createElement("div");

  previewHandDiv.innerHTML = newHand;

  DOMElements.previewHand.appendChild(previewHandDiv);

  DOMElements.previewScore.textContent = GameState.playerHandTwoScore;
}

export function togglePreviewFocusDisplay(
  GameState,
  toggleToFocus,
  toggleToPreview
) {
  if (toggleToFocus) {
    GameState.focusHand = toggleToFocus;
    GameState.previewHand = toggleToPreview || null;
    notifyObservers();
    setFocusHand(GameState);
    setPreviewHand(GameState);
  } else {
    setFocusHand(GameState);
    setPreviewHand(GameState);
  }

  updateScoresDisplay(GameState);
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

export function showdown() {}

export function flipDealerHoleCardUp() {
  // DOMElements.dealerHoleCard.classList.remove("hidden");
  // DOMElements.dealerHoleCard.classList.add("visible");
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

export function resetUI(state) {
  if (state.actionState === "end") {
    DOMElements.focusHand.innerHTML = "";
    DOMElements.dealerHand.innerHTML = "";
  }
}
