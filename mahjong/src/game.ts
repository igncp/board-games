// https://www.mahjongtime.com/hong-kong-mahjong-rules.html
// http://mahjong.wikidot.com/
// https://en.wikipedia.org/wiki/Mahjong_tiles

import { getIsPair } from "./melds";
import { Player } from "./player";
import { createRound, GamePhase, moveRoundAfterWin, Round } from "./round";
import { calculateHandScore, Score } from "./score";
import type { Deck, HandTile, Tile } from "./tiles";
import { getDefaultDeck } from "./tiles";
import { getShuffledArray } from "./util";

type Table = {
  board: Tile["id"][];
  drawWall: Tile["id"][];
  hands: Record<Player["id"], HandTile[]>;
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
  return { id, name: "Player " + index };
};

export const convertToHandTile = (id: Tile["id"]) => {
  return {
    concealed: true,
    id,
    setId: null,
  };
};

export const createTable = (deck: Deck, players: Player[]): Game["table"] => {
  const shuffledDeck = getShuffledArray(Object.keys(deck).map(Number));
  const hands = players.reduce((handsAcc, player) => {
    handsAcc[player.id] = shuffledDeck.splice(0, 13).map(convertToHandTile);

    return handsAcc;
  }, {} as Game["table"]["hands"]);

  return {
    drawWall: shuffledDeck,
    board: [],
    hands,
  };
};

export const createGame = (
  opts: Partial<{ deck: Deck; players: Player[] }> = {}
): Game => {
  const players =
    opts.players || Array.from({ length: 4 }).map(defaultCreatePlayer);

  const deck = opts.deck || getDefaultDeck();
  const table = createTable(deck, players);

  const score = players.reduce((scoreAcc, player) => {
    scoreAcc[player.id] = 0;

    return scoreAcc;
  }, {} as Game["score"]);

  const phase = GamePhase.Beginning;

  const round = createRound();

  return {
    deck,
    phase,
    players,
    round,
    score,
    table,
  };
};

export const drawTileFromWall = ({
  drawWall,
  hands,
  round,
  playerId,
}: {
  drawWall: Table["drawWall"];
  hands: Table["hands"];
  round: Round;
  playerId: Player["id"];
}) => {
  if (!drawWall.length || round.wallTileDrawn !== null) {
    return null;
  }

  const tileId = drawWall.pop() as number;

  round.wallTileDrawn = tileId;
  hands[playerId].push(convertToHandTile(tileId));

  return tileId;
};

export const discardTileToBoard = ({
  board,
  hands,
  playerId,
  tileId,
  round,
}: {
  board: Table["board"];
  hands: Table["hands"];
  playerId: Player["id"];
  tileId: Tile["id"];
  round: Round;
}) => {
  const playerHand = hands[playerId];

  if (playerHand.length !== 14) return null;

  const tileIndex = playerHand.findIndex((t) => t.id === tileId);
  const tile = playerHand[tileIndex];

  if (!tile) return null;
  if (!tile.concealed) return null;

  const { tileClaimed } = round;

  if (
    playerId === round.tileClaimed?.by &&
    tile.id !== tileClaimed!.id &&
    !playerHand.find((t) => t.id === tileClaimed!.id)!.setId
  )
    return null;

  playerHand.splice(tileIndex, 1);

  board.push(tile.id);
  round.tileClaimed = { from: playerId, id: tile.id, by: null };

  return tile.id;
};

export const claimTile = ({
  board,
  hands,
  playerId,
  round,
}: {
  board: Table["board"];
  hands: Table["hands"];
  playerId: Player["id"];
  round: Round;
}) => {
  const playerHand = hands[playerId];

  if (playerHand.length !== 13 || !round.tileClaimed) return null;

  const tile = board.pop();

  if (!tile) return null;

  round.tileClaimed.by = playerId;

  playerHand.push({
    concealed: true,
    id: tile,
    setId: null,
  });

  return true;
};

export const startGame = (game: Game) => {
  game.phase = GamePhase.Playing;
};

export const sayMahjong = (playerId: Player["id"], game: Game) => {
  const playerHand = game.table.hands[playerId];

  if (playerHand.length !== 14) return null;

  const { deck } = game;
  const tilesWithoutMeld = playerHand
    .filter((t) => !t.setId)
    .map((t) => deck[t.id]);

  if (!getIsPair({ hand: tilesWithoutMeld })) return null;

  const hand = game.table.hands[playerId];

  const { round, score } = game;

  calculateHandScore({
    deck,
    hand,
    round,
    score,
    winnerPlayer: playerId,
  });

  moveRoundAfterWin(game);

  game.table = createTable(game.deck, game.players);

  return true;
};
