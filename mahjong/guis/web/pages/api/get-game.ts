import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const client = new PrismaClient();

  const dbGame = await client.game.findUnique({
    where: {
      id: id as string,
    },
    include: {
      players: true,
      hands: true,
    },
  });

  const game = {
    ...dbGame,
    hands: dbGame.hands.reduce((hands, hand) => {
      hands[hand.playerId] = hands[hand.playerId] || [];
      hands[hand.playerId][hand.order] = {
        concealed: hand.concealed,
        id: hand.tileId,
        setId: hand.setId,
      };
      return hands;
    }, {}),
  };

  res.status(200).json({
    game,
  });
};
