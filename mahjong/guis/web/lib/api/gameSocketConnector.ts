import { Socket } from "socket.io";
import { createGame, drawTileFromWall } from "mahjong/dist/src/game";
import { getTileSorter } from "mahjong/dist/src/tiles";
import { Game, Player } from "mahjong/dist/src/core";

import { createDBGame, getFullGameFromDB, saveDBGame } from "./db";
import { getUIGame } from "./transform";
import { getServer } from "./socket";
import {
  SMDrawTilePayload,
  SMGameStartedPayload,
  SMNewPlayerPayload,
  SMPlayersNumPayload,
  SMSortHandPayload,
  SMStartGamePayload,
  SocketMessage,
} from "../socketMessages";

const userIdToSocketIdMap: Record<string, string> = {};

const gamesPlayers: Record<string, string[] | undefined> = {};
const startedGames: Record<string, true | undefined> = {};

const getPlayersNumData = (gameId: Game["id"]) => {
  const payload: SMPlayersNumPayload = { num: gamesPlayers[gameId].length };
  return [SocketMessage.PlayersNum, payload] as const;
};

export const gameSocketConnector = {
  onConnection: (socket: Socket) => {
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
    };

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

        game.players.forEach((player) => {
          updateUserWithGame(player.id, game);
        });
      }
    );
  },
};
