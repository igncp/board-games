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
};

type Table = {
  board: Tile["id"][];
  drawWall: Tile["id"][];
  hands: Record<Player["id"], Tile["id"][]>;
};

// http://mahjongtime.com/Chinese-Official-Mahjong-Scoring.html
type Score = Record<Player["id"], number>;

type Game = {
  deck: Deck;
  players: Player[];
  round: RoundType;
  score: Score;
  table: Table;
};

const createPlayer = (): Player => {
  const id = Math.random().toString();
  return { id };
};

const createGame = (opts: Partial<{ deck: Deck }> = {}): Game => {
  const players = Array.from({ length: 4 }).map(createPlayer);

  const deck = opts.deck || getDefaultDeck();
  const shuffledDeck = getShuffledArray(Object.keys(deck).map(Number));

  const hands = players.reduce((handsAcc, player) => {
    handsAcc[player.id] = shuffledDeck.splice(0, 13);

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

  return {
    deck,
    table,
    players,
    round: RoundType.East,
    score,
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

  hands[playerId].push(tileId);

  return tileId;
};

export { createGame, drawTileFromWall };
