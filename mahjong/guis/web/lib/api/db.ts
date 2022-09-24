import { PrismaClient, Wind, GamePhase } from "@prisma/client";

import {
  Deck,
  Game,
  GamePhase as CoreGamePhase,
  Suit,
  Tile,
  TileType,
  Wind as CoreWind,
} from "mahjong/dist/src/core";

import { GameSummary } from "../../lib/types";

const DEFAULT_DECK_ID = "default-deck";

const flip = <A extends string, B extends string>(
  data: Record<A, B>
): Record<B, A> =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [value, key]));

const windMap: Record<CoreWind, Wind> = {
  [CoreWind.East]: Wind.East,
  [CoreWind.North]: Wind.North,
  [CoreWind.South]: Wind.South,
  [CoreWind.West]: Wind.West,
};

const windMapReverse = flip(windMap);

const gamePhaseMap: Record<CoreGamePhase, GamePhase> = {
  [CoreGamePhase.Beginning]: GamePhase.Beginning,
  [CoreGamePhase.End]: GamePhase.End,
  [CoreGamePhase.Playing]: GamePhase.Playing,
};

const gamePhaseMapReverse = flip(gamePhaseMap);

export const createDBGame = async (game: Game) => {
  const prisma = new PrismaClient();

  const existingDeck = await prisma.tile.findMany({
    where: { deckId: DEFAULT_DECK_ID },
  });

  if (existingDeck.length === 0) {
    await prisma.tile.createMany({
      data: Object.keys(game.deck).map((tileKey) => ({
        deckId: DEFAULT_DECK_ID,
        suit: game.deck[tileKey].suit,
        tileId: game.deck[tileKey].id,
        type: game.deck[tileKey].type,
        value: game.deck[tileKey].value.toString(),
      })),
    });
  }

  const round = await prisma.round.create({
    data: {
      dealerPlayerIndex: game.round.dealerPlayerIndex,
      playerIndex: game.round.playerIndex,
      type: windMap[game.round.type],
    },
  });

  await Promise.all(
    game.players.map((player) =>
      prisma.player.upsert({
        where: { id: player.id },
        create: {
          id: player.id,
          name: player.name,
        },
        update: {},
      })
    )
  );

  await prisma.game.create({
    data: {
      id: game.id,
      name: game.name,
      roundId: round.id,
      deckId: DEFAULT_DECK_ID,
      phase: gamePhaseMap[game.phase],
      hands: {
        create: game.players.reduce((hands, player) => {
          game.table.hands[player.id].forEach((tile, tileIndex) => {
            hands.push({
              concealed: tile.concealed,
              order: tileIndex,
              playerId: player.id,
              setId: tile.setId,
              tileId: tile.id,
            });
          });
          return hands;
        }, []),
      },
    },
  });

  await Promise.all([
    prisma.playerOnGame.createMany({
      data: game.players.map((player, playerIndex) => ({
        gameId: game.id,
        playerId: player.id,
        order: playerIndex,
      })),
    }),
    prisma.score.createMany({
      data: game.players.map((player) => ({
        gameId: game.id,
        playerId: player.id,
        score: game.score[player.id],
      })),
    }),
    prisma.boardTile.createMany({
      data: game.table.board.map((tileId, tileIndex) => ({
        gameId: game.id,
        tileId,
        order: tileIndex,
      })),
    }),
    prisma.wallTile.createMany({
      data: game.table.drawWall.map((tileId, tileIndex) => ({
        gameId: game.id,
        tileId,
        order: tileIndex,
      })),
    }),
  ]);
};

export const saveDBGame = async (game: Game) => {
  const prisma = new PrismaClient();

  const currentGame = await prisma.game.findUnique({
    where: { id: game.id },
  });

  const round = await prisma.round.update({
    where: {
      id: currentGame.roundId,
    },
    data: {
      dealerPlayerIndex: game.round.dealerPlayerIndex,
      playerIndex: game.round.playerIndex,
      tileClaimedBy: game.round.tileClaimed?.by,
      tileClaimedFrom: game.round.tileClaimed?.from,
      tileClaimedId: game.round.tileClaimed?.id,
      type: windMap[game.round.type],
      wallTileDrawn: game.round.wallTileDrawn,
    },
  });

  await prisma.game.update({
    where: {
      id: game.id,
    },
    data: {
      roundId: round.id,
      deckId: DEFAULT_DECK_ID,
      phase: gamePhaseMap[game.phase],
      name: game.name,
    },
  });

  await prisma.hand.deleteMany({
    where: {
      gameId: game.id,
    },
  });

  await prisma.hand.createMany({
    data: game.players.reduce((hands, player) => {
      game.table.hands[player.id].forEach((tile, tileIndex) => {
        hands.push({
          concealed: tile.concealed,
          order: tileIndex,
          playerId: player.id,
          setId: tile.setId,
          tileId: tile.id,
          gameId: game.id,
        });
      });
      return hands;
    }, []),
  });

  await Promise.all([
    prisma.boardTile.deleteMany({
      where: {
        gameId: game.id,
      },
    }),
    prisma.wallTile.deleteMany({
      where: {
        gameId: game.id,
      },
    }),
    prisma.score.deleteMany({
      where: {
        gameId: game.id,
      },
    }),
  ]);

  await Promise.all([
    prisma.boardTile.createMany({
      data: game.table.board.map((tileId, tileIndex) => ({
        gameId: game.id,
        tileId,
        order: tileIndex,
      })),
    }),
    prisma.wallTile.createMany({
      data: game.table.drawWall.map((tileId, tileIndex) => ({
        gameId: game.id,
        tileId,
        order: tileIndex,
      })),
    }),
    prisma.score.createMany({
      data: game.players.map((player) => ({
        gameId: game.id,
        playerId: player.id,
        score: game.score[player.id],
      })),
    }),
  ]);
};

export const getFullGameFromDB = async (id: string): Promise<Game | null> => {
  const prisma = new PrismaClient();

  const dbGame = await prisma.game.findUnique({
    where: {
      id: id as string,
    },
    include: {
      board: true,
      hands: true,
      players: true,
      round: true,
      score: true,
      wall: true,
    },
  });

  if (!dbGame) return null;

  const players = await prisma.player.findMany({
    where: {
      id: {
        in: dbGame.players.map((player) => player.playerId),
      },
    },
  });

  const deckTiles = await prisma.tile.findMany({
    where: {
      deckId: dbGame.deckId,
    },
  });

  const deck = deckTiles.reduce((deck, tile) => {
    deck[tile.tileId] = {
      id: tile.tileId,
      ...(tile.suit && { suit: tile.suit as Suit }),
      type: tile.type as TileType,
      value: tile.suit ? parseInt(tile.value) : tile.value,
    } as Tile;
    return deck;
  }, {} as Deck);

  const hands = dbGame.hands.reduce((hands, handTile) => {
    hands[handTile.playerId] = hands[handTile.playerId] || [];
    hands[handTile.playerId][handTile.order] = {
      id: handTile.tileId,
      setId: handTile.setId,
      concealed: handTile.concealed,
    };

    return hands;
  }, {} as Game["table"]["hands"]);

  const game: Game = {
    id: dbGame.id,
    name: dbGame.name,
    score: dbGame.score.reduce((score, scoreEntry) => {
      score[scoreEntry.playerId] = scoreEntry.score;
      return score;
    }, {}),
    phase: gamePhaseMapReverse[dbGame.phase],
    deck,
    players: dbGame.players
      .sort((playerA, playerB) => playerA.order - playerB.order)
      .map((player) => players.find((p) => p.id === player.playerId)),
    round: {
      dealerPlayerIndex: dbGame.round.dealerPlayerIndex,
      playerIndex: dbGame.round.playerIndex,
      tileClaimed: dbGame.round.tileClaimedId
        ? {
            id: dbGame.round.tileClaimedId,
            by: dbGame.round.tileClaimedBy,
            from: dbGame.round.tileClaimedFrom,
          }
        : null,
      type: windMapReverse[dbGame.round.type],
      wallTileDrawn: dbGame.round.wallTileDrawn,
    },
    table: {
      board: dbGame.board
        .sort((tA, tB) => tA.order - tB.order)
        .map((tile) => tile.tileId),
      drawWall: dbGame.wall
        .sort((tA, tB) => tA.order - tB.order)
        .map((tile) => tile.tileId),
      hands,
    },
  };

  return game;
};

export const getGamesSummaries = async (
  playerId?: string
): Promise<GameSummary[]> => {
  const prisma = new PrismaClient();

  const dbGames = (
    await prisma.game.findMany({
      include: {
        board: true,
        hands: true,
        players: true,
        round: true,
        score: true,
        wall: true,
      },
    })
  ).filter((game) => {
    if (!playerId) return true;

    return game.players.some((player) => player.playerId === playerId);
  });

  const players = (
    await prisma.player.findMany({
      where: {
        id: {
          in: dbGames.reduce((playerIds, game) => {
            game.players.forEach((player) => playerIds.push(player.playerId));
            return playerIds;
          }, []),
        },
      },
    })
  ).reduce((playersObj, player) => {
    playersObj[player.id] = player;
    return playersObj;
  }, {});

  return dbGames.map((dbGame) => {
    return {
      id: dbGame.id,
      name: dbGame.name,
      players: dbGame.players.map((playerInGame) => {
        const player = players[playerInGame.playerId];
        return {
          id: player.id,
          name: player.name,
        };
      }),
    };
  });
};
