import { Board, BoardSlot } from "../constants";

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

type FlatSlot = {
  slot: BoardSlot;
  row: number;
  column: number;
};

type GetFlatSlots = (s: Board["slots"]) => FlatSlot[];

const getFlatSlots: GetFlatSlots = slots => {
  return slots.reduce((acc: FlatSlot[], slotRow, slotRowIdx) => {
    const parsedRow = slotRow.map((slot, slotIdx) => ({
      slot,
      row: slotRowIdx,
      column: slotIdx
    }));

    return acc.concat(parsedRow);
  }, []);
};

export { getIsBoardFull, getFlatSlots };
