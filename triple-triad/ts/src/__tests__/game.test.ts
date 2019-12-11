import { createGame } from "../game";

describe("createGame", () => {
  it("returns a game with expected features", async () => {
    const game = await createGame();

    expect(game.players.length).toEqual(2);
  });
});
