import { Deck, Game, Player, Tile } from "mahjong/dist/src/core";
import { UIGame } from "./types";

export enum SocketMessage {
  ClaimBoardTile = "claimBoardTile",
  DiscardTile = "discardTile",
  DrawTile = "drawTile",
  GameStarted = "gameStarted",
  MoveTurn = "moveTurn",
  NewPlayer = "newPlayer",
  PlayersNum = "playersNum",
  SortHand = "sortHand",
  StartGame = "startGame",
}

// From client to server

export type SMNewPlayerPayload = {
  gameId: Game["id"];
  userId: Player["id"];
};

export type SMStartGamePayload = {
  gameId: Game["id"];
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
