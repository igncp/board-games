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
      slot,
      row: slotRowIdx,
      column: slotIdx
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

export { getIsBoardFull, getFlatSlots, getSurrondingSlotsWithCards };
