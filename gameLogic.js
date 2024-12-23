import { resolveGame } from "./script.js";
import {
  GameState,
  notifyObservers,
  resetGameState,
  updateGameState,
} from "./state.js";
import {
  outcomeAnnouncement,
  togglePreviewFocusDisplay,
  dealCardInUI,
  updateScoresDisplay,
  renderFocusHand,
} from "./ui.js";

export function dealSingleCard(handName, staticCardForTesting) {
  const card = addCardToHandArr(handName, staticCardForTesting);
  dealCardInUI(handName, card);
  notifyObservers(); // hack to get the scores to update? Or solid logic?
}

export function addCardToHandArr(hand, staticCardForTesting) {
  const card = staticCardForTesting || getRandomCard();

  const targetHand = GameState.hands[hand];

  if (targetHand) {
    targetHand.cards.push(card);
    updateGameState(`hands.${hand}.cards`, targetHand.cards);
  } else {
    console.error("Invalid hand name passed from dealSingleCard()");
  }

  removeCurrentCardFromDeck(card, GameState.deck);
  return card;
}

function getRandomCard() {
  const deck = GameState.deck;
  const randomIndex = Math.floor(Math.random() * GameState.deck.length);
  return deck[randomIndex];
}

function removeCurrentCardFromDeck(card, deck) {
  const cardIndex = deck.indexOf(card);
  if (cardIndex !== -1) {
    deck.splice(cardIndex, 1);
  }
}

export function validateWager(wager, bankroll) {
  if (wager <= 0) {
    return "Wager must be greater than zero.";
  }
  if (wager > bankroll) {
    return "Wager cannot exceed your bankroll.";
  }
  return null; // No errors
}

// DOUBLE

export function checkCanDouble() {
  console.log(GameState.hands.userFirst.score);
  if (
    GameState.hands.userFirst.score >= 9 &&
    GameState.hands.userFirst.score <= 11
  ) {
    updateGameState("canDouble", true);
  }
}

export function doubleHit() {
  console.log("double hit");
  dealSingleCard(GameState.hands.focus, { suit: "♣", rank: "K", value: 10 });

  notifyObservers(); // heavy handed , cleaner if actual state change triggered notify...
  updateScoresDisplay();
  setTimeout(toggleSplitHands, 1000);
  setTimeout(() => {
    dealSingleCard(GameState.hands.focus, { suit: "♣", rank: "J", value: 10 });

    notifyObservers(); // heavy handed , cleaner if actual state change triggered notify...
    updateScoresDisplay();
  }, 2000);
}

// SPLIT

// *observer
export function checkCanSplit() {
  if (
    GameState.isSplit === false &&
    GameState.hands.userFirst.cards[0].value ===
      GameState.hands.userFirst.cards[1].value
  ) {
    updateGameState("canSplit", true);
  }
}

export function splitHandArr() {
  const handOne = GameState.hands.userFirst.cards;
  const handTwo = handOne.splice(1, 1);

  updateGameState("hands.userFirst.cards", handOne);
  updateGameState("hands.userSecond.cards", handTwo);
}

export function shouldToggleSplitHands(handName) {
  // Could jam these all in one statement with an or chain
  if (GameState.isSplit === false) {
    return false;
  } else if (
    GameState.hands.userSecond.outcome === "bust" ||
    GameState.hands.userFirst.outcome === "bust"
  ) {
    return false;
  } else if (GameState.hands.userFirst.outcome === "standing") {
    return true;
  }
}

export function toggleSplitHands() {
  GameState.hands.focus === "userFirst"
    ? updateGameState("hands.focus", "userSecond")
    : updateGameState("hands.focus", "userFirst");
  GameState.hands.preview === "userFirst"
    ? updateGameState("hands.preview", "userSecond")
    : updateGameState("hands.preview", "userFirst");
  togglePreviewFocusDisplay(); // First, is the GameState update above completed in time for this? this probably makes more sense as an observer function watching for changes to hands.focus/hands.preview
}

export async function splitShowdown() {
  // you know you'd only get here coming from standing on hand 2 w/out busting
  if (
    GameState.hands.userFirst.outcome === "bust" ||
    GameState.hands.userFirst.resolved === true
  ) {
    determineOutcome();
  } else {
    // focus back to hand 1 to compare scores to dealerHand
    // dealer needs to act
    // focus back to hand 2 to compare scores to dealerHand
    // resolveGame();
    updateGameState("hands.focus", "userFirst");
    updateGameState("hands.preview", "userSecond");

    determineOutcome();
  }
}

// SCORE

export function calculateHandScore(hand) {
  let numAces = hand.filter((card) => card.value === 11).length;
  let nonAces = hand.filter((card) => card.value !== 11);

  let nonAcesTotal = nonAces.reduce((total, card) => total + card.value, 0);

  return totalWithAces(numAces, nonAcesTotal);
}

function totalWithAces(numAces, nonAcesTotal) {
  let total = nonAcesTotal + numAces * 11; // Start by counting all aces as 11

  // Downgrade Aces from 11 to 1 if the total exceeds 21
  while (total > 21 && numAces > 0) {
    total -= 10; // Convert one Ace from 11 to 1
    numAces--;
  }

  return total;
}

// HIT

export function checkBust() {
  const focusHandScore = GameState.hands.focusHand.score;
  focusHandScore > 21 ? handleBust() : false;
}

export function handleBust() {
  const focusHandName = GameState.hands.focus;

  updateGameState(`hands.${focusHandName}.outcome`, "bust");
  updateGameState(`hands.${focusHandName}.resolved`, true);
  if (GameState.isSplit === false) {
    updateGameState("view", "wager");
    resetGameState();
  } else if (GameState.isSplit === true) {
    // base next logic on both resolved?
    if (GameState.hands.userFirst.outcome === "standing") {
      toggleSplitHands();
      determineOutcome();
      resetGameState();
    } else {
      GameState.hands.userFirst.resolved === false ||
      GameState.hands.userSecond.resolved === false
        ? toggleSplitHands()
        : resolveGame();
    }
  } else {
    console.error(
      "Error: Invalid outcome inside handleBust function for GameState.isSplit -->",
      GameState.isSplit
    );
  }
}

export function dealerAction() {
  updateGameState("dealerHoleCardExposed", true);

  while (GameState.hands.dealer.score < 17) {
    dealSingleCard(`dealer`, {
      suit: "♠",
      rank: "8",
      value: 8,
    });

    notifyObservers(); // because I'm not closing this function before calling it again, so i have to notify observers manually before I call it again to get the updated dealerScore state
    updateScoresDisplay();
  }
  if (
    GameState.hands.dealer.score >= 17 &&
    GameState.hands.dealer.score <= 21
  ) {
    return;
  } else if (GameState.hands.dealer.score > 21) {
    updateGameState("hands.dealer.outcome", "bust");
  } else {
    // else what?
  }
}

export function determineOutcome() {
  const focusHandName = GameState.hands.focus;
  dealerAction();
  if (GameState.hands.dealer.outcome === "bust") {
    updateGameState(`hands.${focusHandName}.outcome`, "win");
  } else if (GameState.hands.focusHand.outcome === "bust") {
    // shouldn't ever really run this code, as a player bust should be handled by handleBust() preempting the need to call determineOutcome()
  } else if (GameState.hands.dealer.score > GameState.hands.focusHand.score) {
    updateGameState(`hands.${focusHandName}.outcome`, "lose");
  } else if (GameState.hands.dealer.score < GameState.hands.focusHand.score) {
    updateGameState(`hands.${focusHandName}.outcome`, "win");
    updateGameState(`bankroll`, GameState.bankroll + GameState.currentBet * 2);
  } else if (GameState.hands.dealer.score === GameState.hands.focusHand.score) {
    updateGameState(`hands.${focusHandName}.outcome`, "push");
    updateGameState(`bankroll`, GameState.bankroll + GameState.currentBet * 1);
  } else {
    console.error("Error: Invalid outcome inside determine outcome function");
  }

  updateGameState(`hands.${focusHandName}.resolved`, true);
}
