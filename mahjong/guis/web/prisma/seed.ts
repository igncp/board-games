import { PrismaClient, Wind } from "@prisma/client";

import { createGame } from "mahjong/dist/src/game";
import { Wind as CoreWind } from "mahjong/dist/src/core";

const prisma = new PrismaClient();

const windMap: Record<CoreWind, Wind> = {
  [CoreWind.East]: Wind.East,
  [CoreWind.North]: Wind.North,
  [CoreWind.South]: Wind.South,
  [CoreWind.West]: Wind.West,
};

async function main() {
  const game = createGame();

  console.log(`Start seeding ...`);
  const round = await prisma.round.create({
    data: {
      dealerPlayerIndex: game.round.dealerPlayerIndex,
      playerIndex: game.round.playerIndex,
      type: windMap[game.round.type],
    },
  });

  await prisma.player.createMany({
    data: game.players.map((player) => ({
      id: player.id,
      name: player.name,
    })),
  });

  await prisma.game.create({
    data: {
      id: game.id,
      roundId: round.id,
      players: {
        connect: game.players.map((player) => ({ id: player.id })),
      },
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

  console.log(`Created game with id: ${game.id}`);

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
