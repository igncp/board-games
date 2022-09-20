import { Socket } from "socket.io";
import {
  claimTile,
  createGame,
  discardTileToBoard,
  drawTileFromWall,
} from "mahjong/dist/src/game";
import { continueRound } from "mahjong/dist/src/round";
import { getTileSorter } from "mahjong/dist/src/tiles";
import { Game, Player } from "mahjong/dist/src/core";
import { createMeld } from "mahjong/dist/src/melds";

import { createDBGame, getFullGameFromDB, saveDBGame } from "./db";
import { getUIGame } from "./transform";
import { getServer } from "./socket";
import {
  SMClaimBoardTilePayload,
  SMCreateMeldPayload,
  SMDiscardTilePayload,
  SMDrawTilePayload,
  SMGameStartedAdminPayload,
  SMGameStartedPayload,
  SMMoveTurnPayload,
  SMNewAdminPayload,
  SMNewPlayerPayload,
  SMPlayersNumPayload,
  SMSortHandPayload,
  SMStartGamePayload,
  SocketMessage,
} from "../socketMessages";

const userIdToSocketIdMap: Record<string, string> = {};

const gamesPlayers: Record<string, string[] | undefined> = {};
const gamesAdmins: Record<string, string[] | undefined> = {};
const startedGames: Record<string, true | undefined> = {};

const getPlayersNumData = (gameId: Game["id"]) => {
  const payload: SMPlayersNumPayload = { num: gamesPlayers[gameId].length };
  return [SocketMessage.PlayersNum, payload] as const;
};

const updateUserWithGame = (playerId: Player["id"], game: Game) => {
  const payload: SMGameStartedPayload = {
    deck: game.deck,
    game: getUIGame(game, playerId),
    playerId: playerId,
    players: game.players,
  };

  getServer()
    .sockets.to(userIdToSocketIdMap[playerId])
    .emit(SocketMessage.GameStarted, payload);

  updateAdminsWithGame(game);
};

const updateAdminsWithGame = (game: Game) => {
  const payload: SMGameStartedAdminPayload = game;

  gamesAdmins[game.id]?.forEach((adminSocketId) => {
    getServer()
      .sockets.to(adminSocketId)
      .emit(SocketMessage.GameStartedAdmin, payload);
  });
};

const updateUsersWithGame = (game: Game) => {
  game.players.forEach((player) => updateUserWithGame(player.id, game));
  updateAdminsWithGame(game);
};

export const gameSocketConnector = {
  onConnection: (socket: Socket) => {
    socket.on(
      SocketMessage.NewPlayer,
      async ({ gameId, userId }: SMNewPlayerPayload) => {
        // @ts-expect-error
        socket.playerId = userId;
        userIdToSocketIdMap[userId] = socket.id;

        gamesPlayers[gameId] = gamesPlayers[gameId] || [];
        gamesPlayers[gameId].push(userId);

        socket.join(gameId);

        if (startedGames[gameId]) {
          const existingGame = await getFullGameFromDB(gameId);
          updateUserWithGame(userId, existingGame);
        }

        getServer()
          .sockets.to(gameId)
          .emit(...getPlayersNumData(gameId));

        socket.on("disconnect", () => {
          const playerIndex = gamesPlayers[gameId].indexOf(userId);

          if (playerIndex !== -1) {
            gamesPlayers[gameId].splice(playerIndex, 1);
          }

          getServer()
            .sockets.to(gameId)
            .emit(...getPlayersNumData(gameId));
        });
      }
    );

    // This should only work when passing an authenticated
    socket.on(SocketMessage.NewAdmin, async ({ gameId }: SMNewAdminPayload) => {
      gamesAdmins[gameId] = gamesAdmins[gameId] || [];
      gamesAdmins[gameId].push(socket.id);

      socket.join(gameId);

      if (startedGames[gameId]) {
        const existingGame = await getFullGameFromDB(gameId);
        updateAdminsWithGame(existingGame);
      }

      getServer()
        .sockets.to(gameId)
        .emit(...getPlayersNumData(gameId));

      socket.on("disconnect", () => {
        const adminIndex = gamesAdmins[gameId].indexOf(socket.id);

        if (adminIndex !== -1) {
          gamesAdmins[gameId].splice(adminIndex, 1);
        }
      });
    });

    socket.on(SocketMessage.DrawTile, async ({ gameId }: SMDrawTilePayload) => {
      const game = await getFullGameFromDB(gameId);
      const { drawWall, hands } = game.table;
      const { round } = game;
      const playerId = game.players[round.playerIndex].id;

      const tileId = drawTileFromWall({ drawWall, hands, round, playerId });

      const success = typeof tileId === "number";

      if (success) {
        await saveDBGame(game);
        await updateUserWithGame(playerId, game);
      }
    });

    socket.on(SocketMessage.SortHand, async ({ gameId }: SMSortHandPayload) => {
      const game = await getFullGameFromDB(gameId);
      // @ts-expect-error
      const playerId = socket.playerId as string;
      const { hands } = game.table;
      const { deck } = game;
      const hand = hands[playerId];

      const sorter = getTileSorter(deck);
      hand.sort(sorter);

      await saveDBGame(game);
      await updateUserWithGame(playerId, game);
    });

    socket.on(
      SocketMessage.DiscardTile,
      async ({ gameId, tileId }: SMDiscardTilePayload) => {
        const game = await getFullGameFromDB(gameId);
        // @ts-expect-error
        const playerId = socket.playerId as string;

        const { hands, board } = game.table;
        const { round } = game;

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
          await saveDBGame(game);
          await updateUsersWithGame(game);
        }
      }
    );

    socket.on(SocketMessage.MoveTurn, async ({ gameId }: SMMoveTurnPayload) => {
      const game = await getFullGameFromDB(gameId);

      const success = continueRound(
        game.round,
        Object.values(game.table.hands)
      );

      if (success) {
        await saveDBGame(game);
        await updateUsersWithGame(game);
      }
    });

    socket.on(
      SocketMessage.ClaimBoardTile,
      async ({ gameId }: SMClaimBoardTilePayload) => {
        const game = await getFullGameFromDB(gameId);

        // @ts-expect-error
        const playerId = socket.playerId as string;

        const {
          players,
          round,
          table: { board, hands },
        } = game;

        const success = claimTile({ playerId, board, hands, round, players });

        if (success) {
          await saveDBGame(game);
          await updateUsersWithGame(game);
        }
      }
    );

    socket.on(
      SocketMessage.CreateMeld,
      async ({ gameId, tilesIds }: SMCreateMeldPayload) => {
        const game = await getFullGameFromDB(gameId);

        // @ts-expect-error
        const playerId = socket.playerId as string;
        const { hands } = game.table;
        const { round, deck, players } = game;
        const subHand = hands[playerId].filter((tile) =>
          tilesIds.includes(tile.id)
        );

        const success = createMeld({
          deck,
          playerId,
          players,
          round,
          subHand,
        });

        if (success) {
          await saveDBGame(game);
          await updateUsersWithGame(game);
        }
      }
    );

    socket.on(
      SocketMessage.StartGame,
      async ({ gameId }: SMStartGamePayload) => {
        if (startedGames[gameId]) return;

        startedGames[gameId] = true;

        const game = await (async () => {
          const existingGame = await getFullGameFromDB(gameId);
          if (existingGame) return existingGame;

          const game = createGame({
            gameId,
            players: gamesPlayers[gameId].map((id, idx) => ({
              id,
              name: "Player " + idx,
            })),
          });

          createDBGame(game);

          return game;
        })();

        updateUsersWithGame(game);
      }
    );
  },
};
