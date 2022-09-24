import { Game, HandTile, Player, Round, Tile } from "mahjong/dist/src/core";

type UIRound = Omit<Round, "wallTileDrawn"> & {
  wallTileDrawn: null | boolean | Tile["id"];
};

export type UIGame = {
  board: Game["table"]["board"];
  hand: HandTile[];
  id: string;
  round: UIRound;
  score: Game["score"];
};

export type GameSummary = {
  id: Game["id"];
  name: Game["name"];
  players: Player[];
};
