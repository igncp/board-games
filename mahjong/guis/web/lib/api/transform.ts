import { Game } from "mahjong/dist/src/core";
import { UIGame } from "../types";

export const getUIGame = (game: Game, playerId: string): UIGame => {
  return {
    board: game.table.board,
    hand: game.table.hands[playerId],
    id: game.id,
  };
};
