// https://www.mahjongtime.com/hong-kong-mahjong-rules.html
// http://mahjong.wikidot.com/
// https://en.wikipedia.org/wiki/Mahjong_tiles

import type { Deck, Tile } from "./tiles";
import { getDefaultDeck } from "./tiles";
import { getShuffledArray } from "./util";

enum RoundType {
  East = "east",
  North = "north",
  South = "south",
  West = "west",
}

type Player = {
  id: string;
  name: string;
};

type HandTile = {
  concealed: boolean;
  id: Tile["id"];
  setId: number | null;
};

type Table = {
  board: Tile["id"][];
  drawWall: Tile["id"][];
  hands: Record<Player["id"], HandTile[]>;
};

export enum GamePhase {
  Beginning = "beginning",
  End = "end",
  Playing = "playing",
}

// http://mahjongtime.com/Chinese-Official-Mahjong-Scoring.html
type Score = Record<Player["id"], number>;

type Round = {
  type: RoundType;
  playerIndex: number;
};

export const getCurrentPlayer = ({
  round,
  players,
}: {
  round: Round;
  players: Player[];
}) => {
  return players[round.playerIndex] as Player;
};

export type Game = {
  deck: Deck;
  phase: GamePhase;
  players: Player[];
  round: Round;
  score: Score;
  table: Table;
};

const defaultCreatePlayer = (_: unknown, index: number): Player => {
  const id = Math.random().toString();
  return { id, name: "Player " + (index + 1) };
};

export const convertToHandTile = (id: Tile["id"]) => {
  return {
    concealed: true,
    id,
    setId: null,
  };
};

const createGame = (
  opts: Partial<{ deck: Deck; players: Player[] }> = {}
): Game => {
  const players =
    opts.players || Array.from({ length: 4 }).map(defaultCreatePlayer);

  const deck = opts.deck || getDefaultDeck();
  const shuffledDeck = getShuffledArray(Object.keys(deck).map(Number));

  const hands = players.reduce((handsAcc, player) => {
    handsAcc[player.id] = shuffledDeck.splice(0, 13).map(convertToHandTile);

    return handsAcc;
  }, {} as Game["table"]["hands"]);

  const score = players.reduce((scoreAcc, player) => {
    scoreAcc[player.id] = 0;

    return scoreAcc;
  }, {} as Game["score"]);

  const table = {
    drawWall: shuffledDeck,
    board: [],
    hands,
  };

  const phase = GamePhase.Beginning;

  const round = {
    playerIndex: 0,
    type: RoundType.East,
  };

  return {
    deck,
    phase,
    players,
    round,
    score,
    table,
  };
};

const drawTileFromWall = ({
  drawWall,
  hands,
  playerId,
}: {
  drawWall: Table["drawWall"];
  hands: Table["hands"];
  playerId: Player["id"];
}) => {
  if (!drawWall.length) {
    return null;
  }

  const tileId = drawWall.pop() as number;

  hands[playerId].push(convertToHandTile(tileId));

  return tileId;
};

const startGame = (game: Game) => {
  game.phase = GamePhase.Playing;
};

export { createGame, drawTileFromWall, startGame };
