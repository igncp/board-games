import {
  Player,
  Card,
  CardType,
  Game,
  GamePhase,
  GameDirection
} from "./types";
import { getShuffledArray, extractArrayNItemsOrLess } from "./utils";
import { ALL_CARDS, CARD_ID_TO_CARD_MAP, INITIAL_CARDS_NUM } from "./constants";

type GetNextPlayer = (opts: {
  direction?: GameDirection;
  fromPlayerId: Player["id"];
  playersIds: Player["id"][];
  positions?: number;
}) => Player["id"];

export const getNextPlayer: GetNextPlayer = ({
  direction = GameDirection.Clockwise,
  fromPlayerId,
  playersIds,
  positions = 1
}) => {
  const idx = playersIds.indexOf(fromPlayerId);
  let pos = idx;

  if (direction === GameDirection.Clockwise) {
    for (let i = 0; i < positions; i++) {
      pos = pos === 0 ? playersIds.length - 1 : pos - 1;
    }
  } else {
    for (let i = 0; i < positions; i++) {
      pos = pos === playersIds.length - 1 ? 0 : pos + 1;
    }
  }

  return playersIds[pos];
};

export const isCard = (opts: Partial<Card>) => (card: Card): boolean => {
  return Object.keys(opts).every((key: string) => {
    return card[key as keyof Card] === opts[key as keyof Card];
  });
};

type GetPossibleCardsToPlay = (o: {
  cardOnDiscardPile: Card["id"] | null;
  cardsOnHand: Card["id"][];
}) => Card["id"][];

export const getPossibleCardsToPlay: GetPossibleCardsToPlay = ({
  cardOnDiscardPile,
  cardsOnHand
}) => {
  if (!cardOnDiscardPile) {
    return cardsOnHand;
  }

  const cardOnPileObj = CARD_ID_TO_CARD_MAP[cardOnDiscardPile];
  const cardsOnHandObjs = cardsOnHand.map(c => CARD_ID_TO_CARD_MAP[c]);
  const validCards: Card["id"][] = [];

  const isSameNumber = (c: Card) => {
    return c.type === CardType.Number && c.value === cardOnPileObj.value!;
  };

  const isWildType = (c: Card) => {
    return c.type === CardType.WildNormal || c.type === CardType.WildDrawFour;
  };

  const addCard = (c: Card) => validCards.push(c.id);

  cardsOnHandObjs
    .filter(c => {
      return isWildType(c);
    })
    .forEach(addCard);

  if (cardOnPileObj.type === CardType.Number) {
    cardsOnHandObjs
      .filter(c => {
        return isSameNumber(c);
      })
      .forEach(addCard);
  }

  if (!isWildType(cardOnPileObj)) {
    cardsOnHandObjs
      .filter(c => {
        return c.type === cardOnPileObj.type || c.color === cardOnPileObj.color;
      })
      .forEach(addCard);
  }

  return validCards;
};

export const getGameCurrentPlayer = (game: Game): Player => {
  return game.players.find(p => p.id === game.turn.player)!;
};

export const getOppositeDirection = (
  direction: GameDirection
): GameDirection => {
  return direction === GameDirection.Clockwise
    ? GameDirection.Counterclockwise
    : GameDirection.Clockwise;
};

export const applyEffectOfCardIntoGame = (
  cardId: Card["id"] | null,
  game: Game
): Game => {
  const newGame = { ...game };
  const card = cardId ? CARD_ID_TO_CARD_MAP[cardId] : null;

  const updateTurn = (positions?: number) => {
    const playersIds = newGame.players.map(p => p.id);
    const fromPlayerId = newGame.turn.player;
    const { direction } = newGame;
    newGame.turn = {
      ...newGame.turn,
      player: getNextPlayer({ playersIds, fromPlayerId, direction, positions })
    };
  };

  if (!card) {
    updateTurn();
  } else if (card.type === CardType.Skip) {
    updateTurn(2);
  } else if (card.type === CardType.Reverse) {
    newGame.direction = getOppositeDirection(newGame.direction);
    updateTurn();
  } else {
    updateTurn();
  }

  if (card && card.type === CardType.DrawTwo) {
    const playerId = newGame.turn.player;
    const { board } = newGame;
    const { items: cards, newArray: newDrawPile } = extractArrayNItemsOrLess(
      board.drawPile,
      2
    );

    board.drawPile = newDrawPile;
    newGame.players = newGame.players.map(p =>
      p.id === playerId
        ? {
            ...p,
            cards: p.cards.concat(cards)
          }
        : p
    );
  }

  return newGame;
};

type CreateGame = (o: { playersNum: number; originalDeck?: Card[] }) => Game;

export const createGame: CreateGame = config => {
  if (config.playersNum < 2 || config.playersNum > 10) {
    throw new Error("Wrong number of players");
  }

  const deck = config.originalDeck || getShuffledArray(ALL_CARDS);
  const deckIds: Card["id"][] = deck.map(c => c.id);
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
      const item = deckIds.pop()!;

      player.cards.push(item);
    }
  });

  const discardPile = [deckIds.pop()!];

  const dealerPlayerIdx = 0;
  const direction = GameDirection.Clockwise;

  return {
    dealer: players[dealerPlayerIdx].id,
    direction,
    players,
    phase: GamePhase.Play,
    turn: {
      lastPlayerToPass: null,
      player: getNextPlayer({
        direction,
        fromPlayerId: dealerPlayerIdx,
        playersIds: players.map(p => p.id)
      })
    },
    board: {
      drawPile: deckIds,
      discardPile
    }
  };
};
