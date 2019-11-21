import {
  Card,
  CardColor,
  CardType,
  Game,
  GameDirection,
  GamePhase,
  Player
} from "./types";
import {
  getShuffledArray,
  extractArrayNItemsOrLess,
  getRandomItem
} from "./utils";
import { ALL_CARDS, CARD_ID_TO_CARD_MAP, INITIAL_CARDS_NUM } from "./constants";

type GetNextPlayer = (opts: {
  direction?: GameDirection;
  fromPlayerId: Player["id"];
  playersIds: Player["id"][];
  positions?: number;
}) => Player["id"];

const getNextPlayer: GetNextPlayer = ({
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

const isCard = (opts: Partial<Card>) => (card: Card): boolean => {
  return Object.keys(opts).every((key: string) => {
    return card[key as keyof Card] === opts[key as keyof Card];
  });
};

type GetPossibleCardsToPlay = (o: {
  cardOnDiscardPile: Card["id"] | null;
  cardsOnHand: Card["id"][];
}) => Card["id"][];

const getPossibleCardsToPlay: GetPossibleCardsToPlay = ({
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

const getGameCurrentPlayer = (game: Game): Player => {
  return game.players.find(p => p.id === game.turn.player)!;
};

const getOppositeDirection = (direction: GameDirection): GameDirection => {
  return direction === GameDirection.Clockwise
    ? GameDirection.Counterclockwise
    : GameDirection.Clockwise;
};

type GetCardPoints = (cardId: Card["id"]) => number;

const getCardPoints: GetCardPoints = cardId => {
  const card = CARD_ID_TO_CARD_MAP[cardId]!;

  switch (card.type) {
    case CardType.Number:
      return card.value!;

    case CardType.Skip:
    case CardType.Reverse:
    case CardType.DrawTwo:
      return 20;

    case CardType.WildDrawFour:
    case CardType.WildNormal:
      return 50;

    default:
      return 0;
  }
};

type EndGameRound = (game: Game) => Game;

const endGameRound: EndGameRound = game => {
  const newGame = { ...game };
  newGame.players = newGame.players.map(p => ({ ...p }));
  const winnerPlayer = newGame.players.find(p => p.cards.length === 0);

  if (!winnerPlayer) {
    throw new Error("No player with zero cards found");
  }

  const restOfPlayers = newGame.players.filter(p => p.id !== winnerPlayer.id);
  const newPoints = restOfPlayers.reduce((acc, player) => {
    return (
      acc +
      player.cards.reduce((acc2, cardId) => {
        return acc2 + getCardPoints(cardId);
      }, 0)
    );
  }, 0);

  winnerPlayer.points += newPoints;

  newGame.phase =
    winnerPlayer.points >= 500 ? GamePhase.Finish : GamePhase.EndOfRound;

  return newGame;
};

type MoveOneTurnMutating = (g: Game, positions?: number) => void;

const moveOneTurnMutating: MoveOneTurnMutating = (game, positions) => {
  const playersIds = game.players.map(p => p.id);
  const fromPlayerId = game.turn.player;
  const { direction } = game;

  game.turn = {
    ...game.turn,
    player: getNextPlayer({
      playersIds,
      fromPlayerId,
      direction,
      positions
    })
  };
};

type OnDeclareNextColor = (game: Game) => Promise<CardColor>;

const defaultOnDeclareNextColor = () => {
  const { item: color } = getRandomItem([
    CardColor.Blue,
    CardColor.Green,
    CardColor.Red,
    CardColor.Yellow
  ]);

  return Promise.resolve(color);
};

type ApplyEffectOfCardIntoGame = (o: {
  game: Game;
  playedCard: Card["id"] | null;
  onDeclareNextColor?: OnDeclareNextColor;
}) => Promise<Game>;

const applyEffectOfCardIntoGame: ApplyEffectOfCardIntoGame = async ({
  game,
  onDeclareNextColor = defaultOnDeclareNextColor,
  playedCard: cardId
}) => {
  const newGame = { ...game };
  newGame.board = { ...newGame.board };
  const card = typeof cardId === "number" ? CARD_ID_TO_CARD_MAP[cardId] : null;
  const originalPlayerId = newGame.turn.player;

  if (!card) {
    moveOneTurnMutating(newGame);
  } else if (card.type === CardType.Skip) {
    moveOneTurnMutating(newGame, 2);
  } else if (card.type === CardType.Reverse) {
    if (newGame.players.length > 2) {
      newGame.direction = getOppositeDirection(newGame.direction);
      moveOneTurnMutating(newGame);
    } else {
      moveOneTurnMutating(newGame, 2);
    }
  } else {
    moveOneTurnMutating(newGame);
  }

  const drawNCards = (n: number) => {
    const playerId = newGame.turn.player;
    const { board } = newGame;
    const { items: cards, newArray: newDrawPile } = extractArrayNItemsOrLess(
      board.drawPile,
      n
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
  };

  if (card) {
    if (card.type === CardType.DrawTwo) {
      drawNCards(2);
    } else if (card.type === CardType.WildDrawFour) {
      drawNCards(4);
      moveOneTurnMutating(newGame);
    }
  }

  const getNextColor = async () => {
    if (
      !card ||
      (card.type !== CardType.WildNormal && card.type !== CardType.WildDrawFour)
    ) {
      return null;
    }

    return onDeclareNextColor(newGame);
  };

  // eslint-disable-next-line require-atomic-updates
  newGame.board.nextColorFromWildCard = await getNextColor();

  if (
    newGame.players.find(p => p.id === originalPlayerId)!.cards.length === 0
  ) {
    return endGameRound(newGame);
  }

  return newGame;
};

type ApplyEffectOfFirstDiscardCard = (g: Game) => Game;

const applyEffectOfFirstDiscardCard: ApplyEffectOfFirstDiscardCard = game => {
  const newGame = { ...game };

  const [cardId] = newGame.board.discardPile;

  moveOneTurnMutating(newGame);

  const card = CARD_ID_TO_CARD_MAP[cardId];

  if (card.type === CardType.Skip) {
    moveOneTurnMutating(newGame);
  } else if (card.type === CardType.Reverse) {
    newGame.direction = getOppositeDirection(newGame.direction);
    moveOneTurnMutating(newGame);
  }

  return newGame;
};

type CreateGame = (o: {
  disableFirstCardEffect?: boolean;
  originalDeck?: Card[];
  playersNum: number;
}) => Game;

const createGame: CreateGame = config => {
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

  for (let _ = 0; _ < INITIAL_CARDS_NUM; _ += 1) {
    players.forEach(player => {
      const item = deckIds.pop()!;

      player.cards.push(item);
    });
  }

  const discardPile = [deckIds.pop()!];

  const dealerPlayerIdx = 0;
  const game = {
    dealer: players[dealerPlayerIdx].id,
    direction: GameDirection.Clockwise,
    players,
    phase: GamePhase.Play,
    turn: {
      player: dealerPlayerIdx
    },
    board: {
      discardPile,
      drawPile: deckIds,
      nextColorFromWildCard: null
    }
  };

  return config.disableFirstCardEffect
    ? game
    : applyEffectOfFirstDiscardCard(game);
};

type OnChoosePlayedCard = (opts: {
  game: Game;
  possibleCards: Card["id"][];
}) => Promise<Card["id"] | null>;

type PlayTurn = (o: {
  game: Game;
  onChoosePlayedCard: OnChoosePlayedCard;
  onDeclareNextColor?: OnDeclareNextColor;
}) => Promise<Game>;

const playTurn: PlayTurn = async ({
  game,
  onChoosePlayedCard,
  onDeclareNextColor = defaultOnDeclareNextColor
}) => {
  const newGame = {
    ...game,
    board: { ...game.board, drawPile: game.board.drawPile.slice(0) }
  };

  const { player: playerId } = newGame.turn;

  const { discardPile } = game.board;
  const cardOnDiscardPile: Card["id"] = discardPile[discardPile.length - 1]!;

  let possibleCards = getPossibleCardsToPlay({
    cardOnDiscardPile,
    cardsOnHand: newGame.players.find(p => p.id === playerId)!.cards
  });

  if (!possibleCards.length && newGame.board.drawPile.length) {
    const drawnCard = newGame.board.drawPile.pop()!;

    newGame.players.map(p => {
      return p.id === playerId
        ? {
            ...p,
            cards: p.cards.concat([drawnCard])
          }
        : p;
    });

    possibleCards = getPossibleCardsToPlay({
      cardOnDiscardPile,
      cardsOnHand: [drawnCard]
    });
  }

  let playedCard: Card["id"] | null = null;

  if (possibleCards.length) {
    playedCard = await onChoosePlayedCard({ game, possibleCards });

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

  return applyEffectOfCardIntoGame({
    game: newGame,
    onDeclareNextColor,
    playedCard
  });
};

export const _test: {
  applyEffectOfCardIntoGame?: ApplyEffectOfCardIntoGame;
  applyEffectOfFirstDiscardCard?: ApplyEffectOfFirstDiscardCard;
  defaultOnDeclareNextColor?: OnDeclareNextColor;
  endGameRound?: EndGameRound;
  getCardPoints?: GetCardPoints;
} = {};

// istanbul ignore else
if (process.env.NODE_ENV === "test") {
  Object.assign(_test, {
    applyEffectOfCardIntoGame,
    applyEffectOfFirstDiscardCard,
    defaultOnDeclareNextColor,
    endGameRound,
    getCardPoints
  });
}

export {
  createGame,
  getGameCurrentPlayer,
  getNextPlayer,
  getOppositeDirection,
  getPossibleCardsToPlay,
  isCard,
  playTurn
};
