import {
  BoardSlot,
  Card,
  CardReference,
  Game,
  GamePhase,
  Player
} from "./constants";
import defaultCards from "./defaultCards";
import { getRandomItem } from "./utils";

import { getFlatSlots, getIsBoardFull } from "./helpers/board";

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
        cardCopyUid: "123"
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

  newGame.phase = GamePhase.End;

  return Promise.resolve(newGame);
};

type PlayTurnOpts = {};

type PlayTurn = (g: Game, o?: PlayTurnOpts) => Promise<Game>;

const playTurn: PlayTurn = game => {
  const newGame = { ...game, turn: { ...game.turn } };
  const oppositePlayerId = game.players.find(p => p.id !== game.turn.playerId)!
    .id;

  newGame.board = { ...newGame.board, slots: newGame.board.slots.slice(0) };

  const emptyFlatSlots = getFlatSlots(newGame.board.slots).filter(
    s => s.slot.cardPlayer === null
  );

  if (!emptyFlatSlots.length) {
    return finishGame(newGame);
  }

  const emptyFlatSlot = emptyFlatSlots[0]!;

  newGame.board.slots[emptyFlatSlot.row] = newGame.board.slots[
    emptyFlatSlot.row
  ].slice(0);

  newGame.board.slots[emptyFlatSlot.row][emptyFlatSlot.column].cardPlayer =
    game.turn.playerId;

  newGame.turn.playerId = oppositePlayerId;

  if (getIsBoardFull(newGame.board)) {
    return finishGame(newGame);
  }

  return Promise.resolve(newGame);
};

export { createGame, playTurn };
