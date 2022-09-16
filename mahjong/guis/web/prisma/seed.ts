import { PrismaClient } from "@prisma/client";

import { createGame } from "mahjong/dist/src/game";
import { createDBGame } from "../lib/db";

const prisma = new PrismaClient();

async function main() {
  const game = createGame();

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
