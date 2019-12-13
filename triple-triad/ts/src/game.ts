import {
  BoardSlot,
  Card,
  CardReference,
  Game,
  GamePhase,
  Player,
  RankIndex
} from "./constants";
import defaultCards from "./defaultCards";
import { getRandomItem, createUUId } from "./utils";

import {
  getFlatSlots,
  getIsBoardFull,
  getSurrondingSlotsWithCards
} from "./helpers/board";
import { oppositeRankIndexMap, getCardIdToCardMap } from "./helpers/card";

type CreateGameOpts = {
  getPlayerGameCards?(o: { allCards: Card[] }): Promise<Card["id"][]>;
  getPlayers?(o: { allCards: Card[] }): Promise<Player[]>;
};

type CreateGame = (o?: CreateGameOpts) => Promise<Game>;

const createGame: CreateGame = () => {
  const players: Player[] = [];
  const usedCards = defaultCards;

  for (let playerId = 0; playerId < 2; playerId += 1) {
    const cards: CardReference[] = [];

    for (let cardIdx = 0; cardIdx < 5; cardIdx += 1) {
      const { item: newCard } = getRandomItem(usedCards);

      cards.push({
        cardId: newCard.id,
        cardCopyUid: createUUId()
      });
    }

    players.push({
      allCards: cards,
      gameCards: cards,
      id: playerId
    });
  }

  const slots: BoardSlot[][] = [];

  for (let slotsRow = 0; slotsRow < 3; slotsRow += 1) {
    const row: BoardSlot[] = [];

    for (let slotsColumn = 0; slotsColumn < 3; slotsColumn += 1) {
      row.push({
        cardReference: null,
        cardPlayer: null,
        element: null
      });
    }

    slots.push(row);
  }

  const { item: firstPlayer } = getRandomItem(players);
  const turn = {
    playerId: firstPlayer.id
  };
  const board = {
    slots
  };
  const phase = GamePhase.Playing;

  const game = {
    board,
    phase,
    turn,
    usedCards,
    players
  };

  return Promise.resolve(game);
};

type FinishGame = (g: Game) => Promise<Game>;

const finishGame: FinishGame = game => {
  const newGame = { ...game };

  // > decide winner and allow to choose cards from opponent

  newGame.phase = GamePhase.End;

  return Promise.resolve(newGame);
};

type OnChoosePlayerCard = (
  g: Game
) => Promise<{
  position: {
    row: number;
    column: number;
  };
  cardReference: CardReference;
}>;

type PlayTurnOpts = {
  onChoosePlayerCard?: OnChoosePlayerCard;
};

const defaultOnChoosePlayerCard: OnChoosePlayerCard = game => {
  const flatSlots = getFlatSlots(game.board.slots);
  const emptyFlatSlots = flatSlots.filter(s => s.slot.cardPlayer === null);
  const emptyFlatSlot = emptyFlatSlots[0]!;

  const boardCards = flatSlots
    .filter(s => s.slot.cardReference !== null)
    .map(s => s.slot.cardReference!.cardCopyUid);
  const currentPlayerAvailableCards = game.players
    .find(p => p.id === game.turn.playerId)!
    .gameCards.filter(c => !boardCards.includes(c.cardCopyUid));
  const chosenCard = currentPlayerAvailableCards[0]!;

  return Promise.resolve({
    position: {
      row: emptyFlatSlot.row,
      column: emptyFlatSlot.column
    },
    cardReference: chosenCard
  });
};

type ApplyCardFromPlayerMutating = (g: Game, o: PlayTurnOpts) => Promise<void>;

const applyCardFromPlayerMutating: ApplyCardFromPlayerMutating = async (
  game,
  opts
) => {
  const onChoosePlayerCard =
    opts.onChoosePlayerCard || defaultOnChoosePlayerCard;

  const addedCard = await onChoosePlayerCard(game);

  game.board.slots[addedCard.position.row] = game.board.slots[
    addedCard.position.row
  ].slice(0);

  game.board.slots[addedCard.position.row][
    addedCard.position.column
  ].cardPlayer = game.turn.playerId;

  game.board.slots[addedCard.position.row][
    addedCard.position.column
  ].cardReference = addedCard.cardReference;

  const cardIdToCardMap = getCardIdToCardMap(game.usedCards);

  getSurrondingSlotsWithCards(game.board.slots, {
    row: addedCard.position.row,
    column: addedCard.position.column
  }).forEach(flatSlot => {
    let anotherRankIndex = RankIndex.Right;

    if (flatSlot.row < addedCard.position.row) {
      anotherRankIndex = RankIndex.Down;
    } else if (flatSlot.row > addedCard.position.row) {
      anotherRankIndex = RankIndex.Up;
    } else if (flatSlot.column > addedCard.position.column) {
      anotherRankIndex = RankIndex.Left;
    }

    const currentCardRankIndex = oppositeRankIndexMap[anotherRankIndex];
    const currentCard = cardIdToCardMap[addedCard.cardReference.cardId];
    const anotherCard = cardIdToCardMap[flatSlot.slot.cardReference!.cardId];

    if (
      currentCard.ranks[currentCardRankIndex] >
      anotherCard.ranks[anotherRankIndex]
    ) {
      const { row, column } = flatSlot;

      game.board.slots[row][column] = {
        ...game.board.slots[row][column],
        cardPlayer: game.turn.playerId
      };
    }
  });
};

type PlayTurn = (g: Game, o?: PlayTurnOpts) => Promise<Game>;

const playTurn: PlayTurn = async (game, opts = {}) => {
  const newGame = { ...game, turn: { ...game.turn } };
  const oppositePlayerId = game.players.find(p => p.id !== game.turn.playerId)!
    .id;

  newGame.board = {
    ...newGame.board,
    slots: newGame.board.slots.map(row => row.slice(0))
  };

  if (getIsBoardFull(newGame.board)) {
    return finishGame(newGame);
  }

  await applyCardFromPlayerMutating(newGame, opts);

  newGame.turn.playerId = oppositePlayerId;

  if (getIsBoardFull(newGame.board)) {
    return finishGame(newGame);
  }

  return newGame;
};

export { createGame, playTurn, OnChoosePlayerCard };
