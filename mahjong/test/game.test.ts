import { createGame } from "../src";

describe("createGame", () => {
  it("has 4 players", () => {
    const game = createGame();
    expect(game.players.length).toEqual(4);
  });
});
