import {
  Board,
  CardCopyUid,
  CardElement,
  CardReference,
  Game,
  GamePhase,
  Player,
  RankIndex,
  SlotPosition,
  SpecialRule,
  TradeRule
} from "./constants";
import defaultCards from "./defaultCards";
import { getRandomItem, createUUId } from "./utils";

import {
  createEmptyBoard,
  getFlatSlots,
  getIsBoardFull,
  getSurrondingSlotsWithCards,
  getWinnerPlayerId
} from "./helpers/board";
import { getOppositePlayer } from "./helpers/player";
import {
  oppositeRankIndexMap,
  getCardIdToCardMap,
  getCardRankOffset
} from "./helpers/card";

type OnAddElementsIntoBoard = (board: Board) => Promise<Board>;

const defaultOnAddElementsIntoBoard: OnAddElementsIntoBoard = board => {
  const newBoard = { ...board, slots: board.slots.map(r => r.slice(0)) };
  const probabilityOfElement = 0.3;
  const possibleElements = Object.values(CardElement);

  getFlatSlots(newBoard.slots)
    .filter(() => {
      return Math.random() < probabilityOfElement;
    })
    .forEach(flatSlot => {
      const { item: element } = getRandomItem(possibleElements);
      const { row, column } = flatSlot;

      newBoard.slots[row][column] = { ...flatSlot.slot, element };
    });

  return Promise.resolve(newBoard);
};

type OnChooseFirstPlayer = (game: Game) => Promise<Player["id"]>;

const defaultOnChooseFirstPlayer: OnChooseFirstPlayer = game => {
  const { item: firstPlayer } = getRandomItem(game.players);

  return Promise.resolve(firstPlayer.id);
};

type CreateGameOpts = {
  onAddElementsIntoBoard?: OnAddElementsIntoBoard;
  onChooseFirstPlayer?: OnChooseFirstPlayer;
  specialRules?: SpecialRule[];
};

type CreateGame = (o?: CreateGameOpts) => Promise<Game>;

const createGame: CreateGame = async (opts = {}) => {
  const players: Player[] = [];
  const usedCards = defaultCards;
  const specialRules = opts.specialRules || [];

  for (let playerId = 0; playerId < 2; playerId += 1) {
    const cards: CardReference[] = [];

    for (let cardIdx = 0; cardIdx < 5; cardIdx += 1) {
      const { item: newCard } = getRandomItem(usedCards);

      cards.push({
        cardCopyUid: createUUId(),
        cardId: newCard.id
      });
    }

    players.push({
      allCards: cards,
      gameCards: cards,
      id: playerId,
      wonCards: []
    });
  }

  let board = createEmptyBoard();

  if (specialRules.includes(SpecialRule.Elemental)) {
    const onAddElementsIntoBoard =
      opts.onAddElementsIntoBoard || defaultOnAddElementsIntoBoard;

    board = await onAddElementsIntoBoard(board);
  }

  const turn = {
    playerId: players[0].id
  };
  const phase = GamePhase.Playing;

  const game = {
    board,
    phase,
    players,
    specialRules,
    tradeRule: TradeRule.One,
    turn,
    usedCards
  };

  const onChooseFirstPlayer =
    opts.onChooseFirstPlayer || defaultOnChooseFirstPlayer;
  const firstPlayerId = await onChooseFirstPlayer(game);

  game.turn.playerId = firstPlayerId;

  return game;
};

const defaultOnWinnerChooseCards: OnWinnerChooseCards = async (
  game,
  { winnerPlayerId }
) => {
  const oppositePlayer = getOppositePlayer(game, winnerPlayerId);
  const { gameCards } = oppositePlayer;

  let winnerCards: CardReference[] = [];
  const loserCards: CardReference[] = [];

  if (game.tradeRule === TradeRule.All) {
    winnerCards = gameCards;
  } else if (game.tradeRule === TradeRule.One) {
    const { item: card } = getRandomItem(gameCards);
    winnerCards = [card];
  } else if (game.tradeRule === TradeRule.Direct) {
    getFlatSlots(game.board.slots).forEach(flatSlot => {
      const arr =
        flatSlot.slot.cardPlayer === winnerPlayerId ? winnerCards : loserCards;

      arr.push(flatSlot.slot.cardReference!);
    });
  } else if (game.tradeRule === TradeRule.Difference) {
    const flatSlots = getFlatSlots(game.board.slots);
    const winnerSlots = flatSlots.filter(
      s => s.slot.cardPlayer === winnerPlayerId
    );

    let tmpCards = gameCards;
    const diff = 5 - (flatSlots.length - winnerSlots.length);

    for (let wonCardIdx = 0; wonCardIdx < diff; wonCardIdx += 1) {
      const { item: card, newItems } = getRandomItem(tmpCards);

      winnerCards.push(card);
      tmpCards = newItems;
    }
  }

  const extractCardCopyUid = (c: CardReference) => c.cardCopyUid;

  return {
    loserCards: loserCards.map(extractCardCopyUid),
    winnerCards: winnerCards.map(extractCardCopyUid)
  };
};

type FinishGame = (g: Game, opts: PlayTurnOpts) => Promise<Game>;

const finishGame: FinishGame = async (game, opts) => {
  const onWinnerChooseCards =
    opts.onWinnerChooseCards || defaultOnWinnerChooseCards;

  const newGame = { ...game };

  const winnerPlayerId = getWinnerPlayerId(game.board.slots);

  const { winnerCards, loserCards } = await onWinnerChooseCards(game, {
    winnerPlayerId
  });

  game.players.forEach(p => {
    const cards = p.id === winnerPlayerId ? winnerCards : loserCards;

    p.wonCards = cards;
  });

  newGame.phase = GamePhase.End;

  return Promise.resolve(newGame);
};

type OnChoosePlayerCard = (
  g: Game
) => Promise<{
  position: SlotPosition;
  cardReference: CardReference;
}>;

type OnWinnerChooseCards = (
  g: Game,
  o: { winnerPlayerId: Player["id"] }
) => Promise<{
  winnerCards: CardCopyUid[];
  loserCards: CardCopyUid[];
}>;

type PlayTurnOpts = {
  onWinnerChooseCards?: OnWinnerChooseCards;
  onChoosePlayerCard?: OnChoosePlayerCard;
};

const defaultOnChoosePlayerCard: OnChoosePlayerCard = game => {
  const flatSlots = getFlatSlots(game.board.slots);
  const emptyFlatSlots = flatSlots.filter(s => s.slot.cardPlayer === null);
  const { item: emptyFlatSlot } = getRandomItem(emptyFlatSlots);

  const boardCards = flatSlots
    .filter(s => s.slot.cardReference !== null)
    .map(s => s.slot.cardReference!.cardCopyUid);
  const currentPlayerAvailableCards = game.players
    .find(p => p.id === game.turn.playerId)!
    .gameCards.filter(c => !boardCards.includes(c.cardCopyUid));
  const chosenCard = currentPlayerAvailableCards[0]!;

  return Promise.resolve({
    cardReference: chosenCard,
    position: {
      column: emptyFlatSlot.column,
      row: emptyFlatSlot.row
    }
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

  const currentCard = cardIdToCardMap[addedCard.cardReference.cardId];
  const currentCardRankOffset = getCardRankOffset(
    game,
    currentCard,
    addedCard.position
  );

  getSurrondingSlotsWithCards(game.board.slots, {
    column: addedCard.position.column,
    row: addedCard.position.row
  }).forEach(flatSlot => {
    if (flatSlot.slot.cardPlayer === game.turn.playerId) {
      return;
    }

    let anotherRankIndex = RankIndex.Right;

    if (flatSlot.row < addedCard.position.row) {
      anotherRankIndex = RankIndex.Down;
    } else if (flatSlot.row > addedCard.position.row) {
      anotherRankIndex = RankIndex.Up;
    } else if (flatSlot.column > addedCard.position.column) {
      anotherRankIndex = RankIndex.Left;
    }

    const currentCardRankIndex = oppositeRankIndexMap[anotherRankIndex];
    const anotherCard = cardIdToCardMap[flatSlot.slot.cardReference!.cardId];
    const { row, column } = flatSlot;

    const anotherCardRankOffset = getCardRankOffset(game, anotherCard, {
      column,
      row
    });

    if (
      currentCard.ranks[currentCardRankIndex] + currentCardRankOffset >
      anotherCard.ranks[anotherRankIndex] + anotherCardRankOffset
    ) {
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
  const oppositePlayerId = getOppositePlayer(game, game.turn.playerId).id;

  newGame.board = {
    ...newGame.board,
    slots: newGame.board.slots.map(row => row.slice(0))
  };

  if (getIsBoardFull(newGame.board)) {
    return finishGame(newGame, opts);
  }

  await applyCardFromPlayerMutating(newGame, opts);

  newGame.turn.playerId = oppositePlayerId;

  if (getIsBoardFull(newGame.board)) {
    return finishGame(newGame, opts);
  }

  return newGame;
};

export { createGame, playTurn, OnChoosePlayerCard, OnWinnerChooseCards };
