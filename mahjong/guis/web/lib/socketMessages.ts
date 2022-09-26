import { Deck, Game, HandTile, Tile } from "mahjong/dist/src/core";
import { UIGame } from "./types";

export enum SocketMessage {
  BreakMeld = "breakMeld",
  ClaimBoardTile = "claimBoardTile",
  CreateMeld = "createMeld",
  DiscardTile = "discardTile",
  DrawTile = "drawTile",
  GameStarted = "gameStarted",
  GameStartedAdmin = "gameStartedAdmin",
  MoveTurn = "moveTurn",
  PlayersNum = "playersNum",
  SayMahjong = "sayMahjong",
  SortHand = "sortHand",
}

// From client to server

export type SMCreateMeldPayload = {
  gameId: Game["id"];
  tilesIds: Tile["id"][];
};

export type SMDrawTilePayload = {
  gameId: Game["id"];
};

export type SMSortHandPayload = {
  gameId: Game["id"];
};

export type SMDiscardTilePayload = {
  gameId: Game["id"];
  tileId: Tile["id"];
};

export type SMMoveTurnPayload = {
  gameId: Game["id"];
};

export type SMClaimBoardTilePayload = {
  gameId: Game["id"];
};

export type SMBreakMeldPayload = {
  gameId: Game["id"];
  setId: HandTile["setId"];
};

export type SMSayMahjongPayload = {
  gameId: Game["id"];
};

// From server to client

export type SMPlayersNumPayload = {
  num: number;
};

export type SMGameStartedPayload = {
  deck: Deck;
  game: UIGame;
  playerId: string;
  players: Game["players"];
};

export type SMGameStartedAdminPayload = Game;
