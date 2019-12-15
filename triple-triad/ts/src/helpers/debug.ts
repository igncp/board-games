import { createGame, playTurn, GamePhase } from "..";
import { Game, Board } from "../constants";

type GetBoardStr = (b: Board) => string;

const getBoardStr: GetBoardStr = b => {
  return b.slots
    .map(boardRow => {
      return boardRow
        .map(r => (r.cardPlayer === null ? "_" : r.cardPlayer))
        .join("|");
    })
    .join("\n");
};

export { getBoardStr };
