export function generateCard() {
  /*...*/
}
export function addCardToHand(hand, card) {
  /*...*/
}
export function calculateScore(hand) {
  /*...*/
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
