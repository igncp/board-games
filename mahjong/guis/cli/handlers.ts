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
import { continueRound, GamePhase, Round } from "../../src/round";
import {
  getIsSuitTile,
  HandTile,
  sortTileByValue,
  TileType,
} from "../../src/tiles";
import { formatToEmoji } from "./formatters";
import {
  createMeld,
  getBoardTilePlayerDiff,
  getHandMelds,
  getPossibleMelds,
} from "../../src/melds";

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
    "Wall Tile Drawn: " +
      (typeof game.round.wallTileDrawn === "number").toString(),
    "Current Player: " + game.players[game.round.playerIndex].name,
    "Tile claimed: " +
      (game.round.tileClaimed?.by
        ? game.players.find((p) => p.id === game.round.tileClaimed!.by)!.name +
          " " +
          formatToEmoji(game.deck[game.round.tileClaimed!.id])
        : "No"),
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
  const success = typeof tileId === "number";

  if (tileId) {
    console.log("The tile drawn was:", formatToEmoji(game.deck[tileId]));
  } else {
    console.log("No tile was drawn");
  }

  return success;
};

export const handleListHand = (input: string, game: Game, pretty: boolean) => {
  let [, playerIndex] = input.split(" ").map(Number);
  const { hands } = game.table;
  const { deck, players, round } = game;

  if (playerIndex >= players.length) return;

  const printedPlayers =
    Number.isNaN(playerIndex) || typeof playerIndex !== "number"
      ? players
      : [players[playerIndex]];

  printedPlayers.forEach((player) => {
    const playerId = player.id;
    const hand = hands[playerId];
    const { melds } = getHandMelds({ hand });
    const formatter = pretty
      ? (handTile: HandTile, tileIndex: number) => {
          const { id } = handTile;

          return `[${tileIndex.toString().padStart(2, "0")}](${formatToEmoji(
            deck[id]
          )})`;
        }
      : (handTile: HandTile, tileIndex: number) => {
          const { id, ...rest } = handTile;

          return `- [${tileIndex.toString().padStart(2, "0")}] ${JSON.stringify(
            rest
          )} | ${JSON.stringify(deck[id])}`;
        };
    const joiner = pretty ? " " : "\n";

    console.log("");
    console.log(
      "Player: " +
        player.name +
        (player.id === players[round.playerIndex].id ? "*" : "")
    );
    console.log("Total: " + hand.length);

    console.log(
      [
        hand
          .filter((h) => !h.setId)
          .map(formatter)
          .join(joiner),
        ...Object.keys(melds).map((setId) => {
          const meld = melds[setId as keyof typeof melds];
          if (!meld) return "";

          return (
            "- Meld: " +
            meld.map(formatter).join(joiner) +
            " (" +
            setId +
            ") (concealed: " +
            meld.every((h) => h.concealed) +
            ")"
          );
        }),
      ].join("\n")
    );

    console.log("");
  });
};

export const handleDisplayBoard = (game: Game) => {
  const { board } = game.table;

  console.log("Total: " + board.length);
  const boardTilesStr = board
    .slice(board.length - 1)
    .map((tileId) => {
      return formatToEmoji(game.deck[tileId]);
    })
    .join(" ");

  console.log(boardTilesStr);
};

export const handleDiscardTile = (input: string, game: Game) => {
  const [, playerIndex, tileIndex] = input.split(" ").map(Number);

  if (
    [tileIndex, playerIndex].some(
      (n) => Number.isNaN(n) || typeof n !== "number"
    )
  )
    return null;

  const playerId = game.players[playerIndex].id;
  const { hands, board } = game.table;
  const { round } = game;
  const tileId = hands[playerId].filter((t) => !t.setId)[tileIndex]?.id;

  if (typeof tileId !== "number") {
    console.log("No tile was discarded");
    return;
  }

  const discardedTileId = discardTileToBoard({
    board,
    hands,
    playerId,
    round,
    tileId,
  });

  if (typeof discardedTileId === "number") {
    console.log(
      "The discarded tile was:",
      formatToEmoji(game.deck[discardedTileId])
    );
  } else {
    console.log("No tile was discarded");
  }
};

export const handleClaimTile = (input: string, game: Game) => {
  let [, playerIndex] = input.split(" ").map(Number);

  if (Number.isNaN(playerIndex)) {
    playerIndex = game.round.playerIndex;
  }

  const playerId = game.players[playerIndex].id;

  const {
    table: { board, hands },
    round,
  } = game;

  const success = claimTile({ playerId, board, hands, round });

  if (success) {
    console.log("Tile claimed");
  } else {
    console.log("Tile NOT claimed");
  }
};

export const handleMovePlayer = (game: Game) => {
  const success = continueRound(game.round, Object.values(game.table.hands));

  if (success) {
    console.log("Continued to the next player");
  } else {
    console.log("Did not continue to the next player");
  }

  return success;
};

export const handleNextCombined = (game: Game) => {
  const successMove = handleMovePlayer(game);
  if (!successMove) return;

  const successDraw = handleDrawTile(game);
  if (!successDraw) return;

  handleSortHand("ss " + game.round.playerIndex, game, "suit");

  handleListHand("", game, true);
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

            return sortTileByValue(tileA, tileB);
          }

          if (tileA.type === TileType.Suit && tileB.type !== TileType.Suit)
            return 1;
          if (tileB.type === TileType.Suit && tileA.type !== TileType.Suit)
            return -1;

          return tileA.type.localeCompare(tileB.type);
        }
      : (handTileA, handTileB) => {
          const tileA = deck[handTileA.id];
          const tileB = deck[handTileB.id];

          return sortTileByValue(tileA, tileB);
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

export const handleCreateMeld = (input: string, game: Game) => {
  const [, playerIndex, ...tiles] = input.split(" ").map(Number);
  const { hands } = game.table;
  const { round, deck, players } = game;
  const playerId = players[playerIndex].id;
  const subHand = hands[playerId]
    .filter((t) => !t.setId)
    .filter((_, idx) => tiles.includes(idx));

  const success = createMeld({
    deck,
    playerId,
    players,
    round,
    subHand,
  });

  if (success) {
    console.log("The meld was created");
  } else {
    console.log("The meld was NOT created");
  }
};

export const handlePossibleMelds = (game: Game) => {
  game.players.forEach((player) => {
    const {
      deck,
      round,
      table: { hands },
    } = game;
    const { tileClaimed } = round;
    const canClaimTile =
      tileClaimed && tileClaimed.by === null && tileClaimed.from !== player.id;
    const hand = hands[player.id].concat(
      canClaimTile
        ? [
            {
              concealed: true,
              id: tileClaimed.id,
              setId: null,
            },
          ]
        : []
    );

    const boardTilePlayerDiff = getBoardTilePlayerDiff({
      hand,
      playerId: player.id,
      players: game.players,
      round: canClaimTile
        ? ({
            ...round,
            tileClaimed: { ...round.tileClaimed, by: player.id },
          } as Round)
        : round,
    });

    const possibleMelds = getPossibleMelds({
      boardTilePlayerDiff,
      deck,
      hand,
      round,
    });

    if (possibleMelds.length) {
      console.log("Player: " + player.name);
      possibleMelds.forEach((meld) => {
        console.log(
          "Possible meld: " +
            meld.map((tileId) => formatToEmoji(deck[tileId])).join(" ")
        );
      });
      console.log("");
    }
  });
};
