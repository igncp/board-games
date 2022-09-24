import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

import { createGame } from "mahjong/dist/src/game";
import { createDBGame } from "../lib/api/db";

const prisma = new PrismaClient();

async function main() {
  const game = createGame({ gameId: uuid(), name: "Test game" });

  console.log(`Start seeding ...`);

  await createDBGame(game);

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
