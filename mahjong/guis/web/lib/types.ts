import { Game, HandTile } from "mahjong/dist/src/core";

export type UIGame = {
  board: Game["table"]["board"];
  hand: HandTile[];
  id: string;
};
