import { Game, HandTile, Round, Tile } from "mahjong/dist/src/core";

type UIRound = Omit<Round, "wallTileDrawn"> & {
  wallTileDrawn: null | boolean | Tile["id"];
};

export type UIGame = {
  board: Game["table"]["board"];
  hand: HandTile[];
  id: string;
  round: UIRound;
};
