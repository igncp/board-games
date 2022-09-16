import { Deck, Game, Player } from "mahjong/dist/src/core";
import { UIGame } from "./types";

export enum SocketMessage {
  NewPlayer = "newPlayer",
  PlayersNum = "playersNum",
  StartGame = "startGame",
  GameStarted = "gameStarted",
}

// From client to server

export type SMNewPlayerPayload = {
  gameId: Game["id"];
  userId: Player["id"];
};

export type SMStartGamePayload = {
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
