import { Card, Game } from "./types";
import { ALL_CARDS } from "./constants";
import {
  applyEffectOfCardIntoGame,
  createGame,
  getPossibleCardsToPlay
} from "./gameHelpers";
import { getShuffledArray } from "./utils";

type GameConfig = { playersNum: number };

const setupGame = (config: GameConfig): Game => {
  const deck = getShuffledArray(ALL_CARDS);

  return createGame({ ...config, originalDeck: deck });
};

const playTurn = (game: Game): Game => {
  const newGame = {
    ...game,
    board: { ...game.board, drawPile: game.board.drawPile.slice(0) }
  };

  const { player: playerId } = newGame.turn;

  const { discardPile } = game.board;
  const cardOnDiscardPile: Card["id"] | null =
    discardPile[discardPile.length - 1] || null;

  let optionalCards = getPossibleCardsToPlay({
    cardOnDiscardPile,
    cardsOnHand: newGame.players.find(p => p.id === playerId)!.cards
  });

  if (!optionalCards.length && newGame.board.drawPile.length) {
    const drawnCard = newGame.board.drawPile.pop()!;

    newGame.players.map(p => {
      return p.id === playerId
        ? {
            ...p,
            cards: p.cards.concat([drawnCard])
          }
        : p;
    });

    optionalCards = getPossibleCardsToPlay({
      cardOnDiscardPile,
      cardsOnHand: [drawnCard]
    });
  }

  let playedCard: Card["id"] | null = null;

  if (optionalCards.length) {
    playedCard = optionalCards.pop()!;

    newGame.board.discardPile = newGame.board.discardPile.concat([playedCard!]);

    newGame.players.map(p => {
      return p.id === playerId
        ? {
            ...p,
            cards: p.cards.filter(c => c !== playedCard)
          }
        : p;
    });
  }

  return applyEffectOfCardIntoGame(playedCard, newGame);
};

export { setupGame, playTurn };
