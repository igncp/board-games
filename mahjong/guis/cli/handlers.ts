import path from "node:path";
import fs from "node:fs";

import {
  claimTile,
  discardTileToBoard,
  drawTileFromWall,
  startGame,
  sayMahjong,
  getPossibleMeldsInGame,
  getPossibleMeldsInGameByDiscard,
} from "../../src/game";
import { continueRound } from "../../src/round";
import { getTileSorter, sortTileByValue } from "../../src/tiles";
import { createMeld, getHandMelds } from "../../src/melds";
import { getCurrentPlayer } from "../../src/player";
import { Game, GamePhase, HandTile, Player } from "../../src/core";

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
    "Wall Tile Drawn: " +
      (typeof game.round.wallTileDrawn === "number").toString(),
    "Current Player: " + game.players[game.round.playerIndex].name,
    "Tile claimed: " +
      (game.round.tileClaimed?.by
        ? game.players.find((p) => p.id === game.round.tileClaimed!.by)!.name +
          " " +
          formatToEmoji(game.deck[game.round.tileClaimed!.id])
        : "No"),
    "Score:",
    ...game.players.map((player) => {
      return "- " + player.name + ": " + game.score[player.id];
    }),
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
    players,
    round,
    table: { board, hands },
  } = game;

  const success = claimTile({ playerId, board, hands, round, players });

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
      ? getTileSorter(deck)
      : (handTileA, handTileB) => {
          const tileA = deck[handTileA.id];
          const tileB = deck[handTileB.id];

          return sortTileByValue(tileA, tileB);
        }
  );

  console.log("Sorted");
};

const EXPORT_FILE_PATH = path.resolve("/tmp/mahjong-exports.json");

export const handleExportGame = (input: string, game: Game) => {
  const [, filePath = EXPORT_FILE_PATH] = input.split(" ");
  fs.writeFileSync(filePath, JSON.stringify(game, null, 2));
  console.log("Exported " + filePath);
};

export const handleImportGame = (input: string, game: Game) => {
  const [, filePath = EXPORT_FILE_PATH] = input.split(" ");
  const file = fs.readFileSync(filePath, "utf-8");
  const fileContent = JSON.parse(file);
  Object.assign(game, fileContent);
  console.log("Imported " + filePath);
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
  const gameMelds = getPossibleMeldsInGame(game);
  const loggedPlayers: Set<Player["id"]> = new Set();

  if (gameMelds.length) {
    gameMelds.forEach((meld) => {
      if (!loggedPlayers.has(meld.playerId)) {
        loggedPlayers.add(meld.playerId);
        const player = game.players.find(
          (p) => p.id === meld.playerId
        ) as Player;

        console.log("");
        console.log("Player: " + player.name);
      }

      console.log(
        "Possible meld: " +
          meld.tiles.map((tileId) => formatToEmoji(game.deck[tileId])).join(" ")
      );
    });

    console.log("");
  } else {
    console.log("No possible melds");
  }
};

export const handlePossibleMeldsByDiscard = (game: Game) => {
  console.log("Melds without discarding");
  const melds = getPossibleMeldsInGameByDiscard(game);

  melds?.forEach((meld) => {
    console.log("");
    if (meld.discardTile) {
      console.log(
        "Meld when discarding: " + formatToEmoji(game.deck[meld.discardTile])
      );
    }
    const player = game.players.find((p) => p.id === meld.playerId) as Player;
    console.log("Player: " + player.name);
    console.log(
      meld.tiles.map((tileId) => formatToEmoji(game.deck[tileId])).join(" ")
    );
  });
};

export const handleSayMahjong = (game: Game) => {
  const playerWith14Tiles = game.players.find((player) => {
    const hand = game.table.hands[player.id];
    return hand.length === 14;
  });

  if (!playerWith14Tiles) {
    console.log("No player has 14 tiles");
    return;
  }

  const success = sayMahjong(playerWith14Tiles.id, game);

  console.log(success ? "New hand started" : "Mahjong was not valid");
};
