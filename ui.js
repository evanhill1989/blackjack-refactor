import { GameState, updateGameState } from "./state.js";

export const DOMElements = {
  mainElement: document.querySelector("main"),
  actionsDiv: document.querySelector(".in-hand-actions"),

  initialWagerView: document.getElementById("initial-wager"),
  gameBoardView: document.getElementById("game-board"),

  wagerInput: document.getElementById("wager-input"),
  focusHand: document.getElementById("focus-hand"),
  dealerHand: document.getElementById("dealer-hand"),
  previewHand: document.getElementById("preview-hand"),

  bankrollDisplay: document.getElementById("bankroll"),
  bankrollTabDisplay: document.getElementById("bankroll_tab"),
  outcomeMessageDisplay: document.getElementById("message"),

  splitBtn: document.getElementById("split-btn"),
  doubleBtn: document.getElementById("double-btn"),
  hitBtn: document.getElementById("hit-btn"),
  standBtn: document.getElementById("stand-btn"),

  // Add more elements as needed
  // Lazy Load
  playerScore: document.getElementById("user-score"),
  dealerScore: document.getElementById("dealer-score"),
};

export function toggleView(GameState) {
  if (GameState.view === "wager") {
    console.log("UI should toggle towager");
    DOMElements.gameBoardView.classList.add("hidden");
    DOMElements.initialWagerView.classList.remove("hidden");
  } else {
    console.log("UI should toggle to board");
    DOMElements.gameBoardView.classList.remove("hidden");
    DOMElements.initialWagerView.classList.add("hidden");
  }
}

export function updateBankrollDisplay(state) {
  DOMElements.bankrollDisplay.textContent = state.bankroll;
  DOMElements.bankrollTabDisplay.textContent = state.bankroll;
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

export function outcomeAnnouncement(GameState) {
  const focusHand = GameState.focusHand;
  let outcome =
    focusHand === "playerHandOne"
      ? GameState.playerHandOneOutcome
      : GameState.playerHandTwoOutcome;

  if (outcome === "bust") {
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
}

export function splitUI(GameState) {
  setFocusHand(GameState);
  setPreviewHand(GameState);
  DOMElements.splitBtn.disabled = true;
  toggleVisibility(DOMElements.previewHand);
  const testButton = document.createElement("button");
  testButton.textContent = "Test Button";
  testButton.addEventListener("click", () => {
    togglePreviewFocus(GameState);
  });
  DOMElements.actionsDiv.appendChild(testButton);
}

export function splitStandUI(GameState) {
  console.log("inside splitStandUI");
  let currentAction = GameState.actionState;
  console.log(currentAction, "currentAction from splitStandUI");
  currentAction === "splitHandTwoAction"
    ? splitTogglePreviewFocus(GameState)
    : splitStandHandTwo(GameState);
}

export function splitTogglePreviewFocus(GameState) {
  togglePreviewFocus(GameState);
}

export function splitStandHandTwo(GameState) {
  // check
  console.log("inside splitStandHandTwo");
}

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
}

export function togglePreviewFocus(GameState) {
  const focusHand = GameState.focusHand;
  const previewHand = GameState.previewHand;
  focusHand === "playerHandOne"
    ? (GameState.focusHand = "playerHandTwo")
    : (GameState.focusHand = "playerHandOne");
  previewHand === "playerHandOne"
    ? (GameState.previewHand = "playerHandTwo")
    : (GameState.previewHand = "playerHandOne");
  setFocusHand(GameState);
  setPreviewHand(GameState);
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
  const element = DOMElements.focusHand;
  return element.removeChild(element.lastChild);
}

export function showdown() {}

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

export function handlePlayerBust(state) {
  if (state.playerHandOneOutcome === "bust") {
    // updateGameState("actionState", "showdown");
    // updateBankroll(state, "lose");
    // updateBankrollDisplay(state.bankroll);
  }
}
