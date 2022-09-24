import { getFullGameFromDB, saveDBGame } from "../../../lib/api/db";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { gameId, name } = req.body;

  if (!name) {
    res.status(400).send("Missing name");
    return;
  }

  try {
    const game = await getFullGameFromDB(gameId);

    game.name = name;

    await saveDBGame(game);

    res.send(200);
  } catch {
    res.send(500);
  }
};
