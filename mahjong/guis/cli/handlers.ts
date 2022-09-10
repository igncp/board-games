import path from "node:path";
import fs from "node:fs";

import {
  Game,
  claimTile,
  discardTileToBoard,
  drawTileFromWall,
  getCurrentPlayer,
  startGame,
} from "../../src/game";
import { continueRound, GamePhase } from "../../src/round";
import { getIsSuitTile, Tile, TileType } from "../../src/tiles";
import { formatToEmoji } from "./formatters";

export const handleGetPlayer = (game: Game) => {
  const player = getCurrentPlayer(game);
  console.log("The current player is: " + player.name + " (" + player.id + ")");
};

export const handleStartGame = (game: Game) => {
  startGame(game);
  console.log("Game started");
};

type Texts = {
  phase: Record<GamePhase, string>;
};

const texts: Texts = {
  phase: {
    [GamePhase.Beginning]: "Beginning",
    [GamePhase.End]: "Finished",
    [GamePhase.Playing]: "Playing",
  },
};

const getGameShortSummary = (game: Game) => {
  return [
    "Game Info",
    "=========",
    "Phase: " + texts.phase[game.phase],
    "Round Type: " + game.round.type,
    "Round Dealer: " + game.round.dealerPlayerIndex,
    "Current Player: " + game.round.playerIndex,
  ].join("\n");
};

export const handleShowGameSummary = (game: Game) => {
  console.log(getGameShortSummary(game));
};

export const handleDrawTile = (game: Game) => {
  const { drawWall, hands } = game.table;
  const { round } = game;
  const playerId = game.players[round.playerIndex].id;

  const tileId = drawTileFromWall({ drawWall, hands, round, playerId });

  if (tileId) {
    console.log("The tile drawn was:", JSON.stringify(game.deck[tileId]));
  } else {
    console.log("No tile was drawn");
  }
};

export const handleListHand = (input: string, game: Game, pretty: boolean) => {
  const [, playerIndex] = input.split(" ").map(Number);
  const { hands } = game.table;
  const { round, deck } = game;
  const playerId =
    game.players[
      Number.isNaN(playerIndex) || typeof playerIndex !== "number"
        ? round.playerIndex
        : playerIndex
    ].id;
  const hand = hands[playerId];

  console.log("Total: " + hand.length);
  const handsStr = hand
    .map(
      pretty
        ? (handTile, tileIndex) => {
            const { id } = handTile;

            return `[${tileIndex.toString().padStart(2, "0")}](${formatToEmoji(
              deck[id]
            )})`;
          }
        : (handTile, tileIndex) => {
            const { id, ...rest } = handTile;

            return `- [${tileIndex
              .toString()
              .padStart(2, "0")}] ${JSON.stringify(rest)} | ${JSON.stringify(
              deck[id]
            )}`;
          }
    )
    .join(pretty ? " " : "\n");

  console.log(handsStr);
};

export const handleDisplayBoard = (game: Game) => {
  const { board } = game.table;
  const { deck } = game;

  console.log("Total: " + board.length);
  const boardTilesStr = board
    .map((tileId, tileIndex) => {
      return `- [${tileIndex.toString().padStart(2, "0")}] ${JSON.stringify(
        deck[tileId]
      )}`;
    })
    .join("\n");

  console.log(boardTilesStr);
};

export const handleDiscardTile = (input: string, game: Game) => {
  const [, tileIndex] = input.split(" ").map(Number);

  if (Number.isNaN(tileIndex)) return null;

  const playerId = game.players[game.round.playerIndex].id;
  const { hands, board } = game.table;

  const discardedTileId = discardTileToBoard({
    board,
    hands,
    playerId,
    tileIndex,
  });

  if (discardedTileId) {
    console.log(
      "The discarded tile was:",
      JSON.stringify(game.deck[discardedTileId])
    );
  } else {
    console.log("No tile was discarded");
  }
};

export const handleClaimTile = (input: string, game: Game) => {
  const [, playerIndex] = input.split(" ").map(Number);

  if (Number.isNaN(playerIndex)) return null;

  const playerId = game.players[game.round.playerIndex].id;

  const {
    table: { board, hands },
    round,
  } = game;

  claimTile({ playerId, board, hands, round });
};

export const handleMovePlayer = (game: Game) => {
  continueRound(game.round);
};

export const handleSortHand = (
  input: string,
  game: Game,
  sort: "suit" | "value"
) => {
  const [, playerIndex] = input.split(" ").map(Number);
  const { hands } = game.table;
  const { round, deck } = game;
  const playerId =
    game.players[
      Number.isNaN(playerIndex) || typeof playerIndex !== "number"
        ? round.playerIndex
        : playerIndex
    ].id;
  const hand = hands[playerId];

  if (hand.length === 14) return;

  const sortByValue = (tileA: Tile, tileB: Tile) => {
    if (typeof tileA.value === "number" && typeof tileB.value === "number") {
      return tileA.value - tileB.value;
    }

    return tileA.value.toString().localeCompare(tileB.value.toString());
  };

  hand.sort(
    sort === "suit"
      ? (handTileA, handTileB) => {
          const tileA = deck[handTileA.id];
          const tileB = deck[handTileB.id];

          if (tileA.type === tileB.type) {
            if (
              getIsSuitTile(tileA) &&
              getIsSuitTile(tileB) &&
              tileA.suit !== tileB.suit
            ) {
              return tileA.suit.localeCompare(tileB.suit);
            }

            return sortByValue(tileA, tileB);
          }

          if (tileA.type === TileType.Suit) return 1;

          return tileA.type.localeCompare(tileB.type);
        }
      : (handTileA, handTileB) => {
          const tileA = deck[handTileA.id];
          const tileB = deck[handTileB.id];

          return sortByValue(tileA, tileB);
        }
  );

  console.log("Sorted");
};

const EXPORT_FILE_PATH = path.resolve("/tmp/mahjong-exports.json");

export const handleExportGame = (game: Game) => {
  fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(game, null, 2));
  console.log("Exported");
};

export const handleImportGame = (game: Game) => {
  const file = fs.readFileSync(EXPORT_FILE_PATH, "utf-8");
  const fileContent = JSON.parse(file);
  Object.assign(game, fileContent);
  console.log("Imported");
};
