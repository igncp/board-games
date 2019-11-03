import {
  Card,
  CardColor,
  CardType,
  Game,
  GameDirection,
  GamePhase,
  Player
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
        const card = CARD_ID_TO_CARD_MAP[cardId]!;

        if (card.type === CardType.Number) {
          return acc2 + card.value!;
        }

        return acc2;
      }, 0)
    );
  }, 0);

  winnerPlayer.points += newPoints;

  newGame.phase =
    winnerPlayer.points >= 500 ? GamePhase.Finish : GamePhase.EndOfRound;

  return newGame;
};

type OnDeclareNextColor = (game: Game) => CardColor;

type ApplyEffectOfCardIntoGame = (o: {
  game: Game;
  playedCard: Card["id"] | null;
  onDeclareNextColor: OnDeclareNextColor;
}) => Game;

const applyEffectOfCardIntoGame: ApplyEffectOfCardIntoGame = ({
  game,
  onDeclareNextColor,
  playedCard: cardId
}) => {
  const newGame = { ...game };
  newGame.board = { ...newGame.board };
  const card = typeof cardId === "number" ? CARD_ID_TO_CARD_MAP[cardId] : null;
  const originalPlayerId = newGame.turn.player;

  const updateTurn = (positions?: number) => {
    const playersIds = newGame.players.map(p => p.id);
    const fromPlayerId = newGame.turn.player;
    const { direction } = newGame;
    newGame.turn = {
      ...newGame.turn,
      player: getNextPlayer({
        playersIds,
        fromPlayerId,
        direction,
        positions
      })
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
      updateTurn();
    }
  }

  newGame.board.nextColorFromWildCard =
    card &&
    (card.type === CardType.WildNormal || card.type === CardType.WildDrawFour)
      ? onDeclareNextColor(game)
      : null;

  if (
    newGame.players.find(p => p.id === originalPlayerId)!.cards.length === 0
  ) {
    return endGameRound(newGame);
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
      discardPile,
      drawPile: deckIds,
      nextColorFromWildCard: null
    }
  };
};

type OnChoosePlayedCard = (opts: {
  game: Game;
  possibleCards: Card["id"][];
}) => Card["id"] | null;

type PlayTurn = (o: {
  game: Game;
  onChoosePlayedCard: OnChoosePlayedCard;
  onDeclareNextColor: OnDeclareNextColor;
}) => Game;

export const playTurn: PlayTurn = ({
  game,
  onChoosePlayedCard,
  onDeclareNextColor
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
    playedCard = onChoosePlayedCard({ game, possibleCards });

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
  endGameRound?: EndGameRound;
} = {};

// istanbul ignore else
if (process.env.NODE_ENV === "test") {
  _test.applyEffectOfCardIntoGame = applyEffectOfCardIntoGame;
  _test.endGameRound = endGameRound;
}
