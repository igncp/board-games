import {
  Card,
  Game,
  GameConfig,
  GamePhase,
  Player
} from "./types";
import { INITIAL_CARDS_NUM, ALL_CARDS } from "./constants";
import {
  getLeftPlayer,
  getPossibleCardsToPlay,
  getRandomItem,
  getShuffledArray
} from "./helpers";

const setupGame = (config: GameConfig): Game => {
  if (config.playersNum < 2 || config.playersNum > 10) {
    throw new Error("Wrong number of players");
  }

  const deck = getShuffledArray(ALL_CARDS);
  let deckIds: Card["id"][] = deck.map(c => c.id);
  const players: Player[] = [];

  for (let i = 0; i < config.playersNum; i++) {
    players.push({
      cards: [],
      id: i,
      points: 0
    });
  }

  players.forEach(player => {
    for (let i = 0; i < INITIAL_CARDS_NUM; i++) {
      const { item, newItems } = getRandomItem(deckIds);
      player.cards.push(item);
      deckIds = newItems;
    }
  });

  const dealerPlayerIdx = 0;

  return {
    dealer: players[dealerPlayerIdx].id,
    players,
    phase: GamePhase.Setup,
    turn: {
      player: getLeftPlayer(players.map(p => p.id), dealerPlayerIdx)
    },
    board: {
      drawPile: deckIds,
      discardPile: []
    }
  };
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

  // > run effect of card if used

  newGame.turn = {
    ...newGame.turn,
    player: getLeftPlayer(newGame.players.map(p => p.id), newGame.turn.player)
  };

  return newGame;
};

export { setupGame, playTurn };
