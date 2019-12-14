import { Board, BoardSlot, Player } from "../constants";

type GetIsBoardFull = (b: Board) => boolean;

const getIsBoardFull: GetIsBoardFull = board => {
  const { slots } = board;

  for (let boardRowIdx = 0; boardRowIdx < slots.length; boardRowIdx += 1) {
    const row = slots[boardRowIdx];

    for (let slotIdx = 0; slotIdx < row.length; slotIdx += 1) {
      const slot = row[slotIdx];

      if (slot.cardPlayer === null) {
        return false;
      }
    }
  }

  return true;
};

type SlotPosition = {
  row: number;
  column: number;
};

type FlatSlot = {
  slot: BoardSlot;
} & SlotPosition;

type GetFlatSlots = (s: Board["slots"]) => FlatSlot[];

const getFlatSlots: GetFlatSlots = slots => {
  return slots.reduce((acc: FlatSlot[], slotRow, slotRowIdx) => {
    const parsedRow = slotRow.map((slot, slotIdx) => ({
      column: slotIdx,
      row: slotRowIdx,
      slot
    }));

    return acc.concat(parsedRow);
  }, []);
};

type GetSurrondingSlotsWithCards = (
  s: Board["slots"],
  p: SlotPosition
) => FlatSlot[];

const getSurrondingSlotsWithCards: GetSurrondingSlotsWithCards = (
  slots,
  position
) => {
  return getFlatSlots(slots).filter(flatSlot => {
    const isDifferentSlot =
      flatSlot.row !== position.row || flatSlot.column !== position.column;

    return (
      isDifferentSlot &&
      flatSlot.slot.cardPlayer !== null &&
      Math.abs(flatSlot.row - position.row) <= 1 &&
      Math.abs(flatSlot.column - position.column) <= 1
    );
  });
};

type GetWinner = (slots: Board["slots"]) => Player["id"];

const getWinnerPlayerId: GetWinner = slots => {
  type Stats = { [playerId: string]: number };

  const stats: Stats = getFlatSlots(slots).reduce((acc: Stats, flatSlot) => {
    if (flatSlot.slot.cardPlayer !== null) {
      acc[flatSlot.slot.cardPlayer] = (acc[flatSlot.slot.cardPlayer] || 0) + 1;
    }

    return acc;
  }, {});

  return Object.keys(stats).reduce((acc, playerIdStr) => {
    if (stats[playerIdStr] > (stats[acc] || 0)) {
      return Number(playerIdStr);
    }

    return acc;
  }, 0);
};

type CreateEmptyBoard = () => Board;

const createEmptyBoard: CreateEmptyBoard = () => {
  const slots: BoardSlot[][] = [];

  for (let slotsRow = 0; slotsRow < 3; slotsRow += 1) {
    const row: BoardSlot[] = [];

    for (let slotsColumn = 0; slotsColumn < 3; slotsColumn += 1) {
      row.push({
        cardPlayer: null,
        cardReference: null,
        element: null
      });
    }

    slots.push(row);
  }

  return {
    slots
  };
};

export {
  createEmptyBoard,
  getFlatSlots,
  getIsBoardFull,
  getSurrondingSlotsWithCards,
  getWinnerPlayerId
};
