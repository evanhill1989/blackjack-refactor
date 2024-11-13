export function addCardToHandArr(GameState, hand) {
  const { playerHand, dealerHand, deck } = GameState;
  const card = getRandomCard(deck);
  hand.push(card);
  removeCurrentCardFromDeck(card, deck);
}

function getRandomCard(deck) {
  const randomIndex = Math.floor(Math.random() * deck.length);
  return deck[randomIndex];
}

function removeCurrentCardFromDeck(card, deck) {
  const cardIndex = deck.indexOf(card);
  if (cardIndex !== -1) {
    deck.splice(cardIndex, 1);
  }
}

export function calculateScore(hand) {
  /*Decode card values*/
  /*Add card values*/
}
export function updateGameStateAfterCardDeal(hand) {
  /*...*/
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

function checkBust(hand) {
  // Returns true if hand is bust
}
