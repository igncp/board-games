import { createGame } from "../..";

import { getWinnerPlayerId } from "../board";

describe("getWinnerPlayerId", () => {
  it("does not fail when some card player is null (unexpected)", async () => {
    const game = await createGame();

    game.board.slots[0][0].cardPlayer = game.players[1].id;

    const result = getWinnerPlayerId(game.board.slots);

    expect(result).toEqual(game.players[1].id);
  });
});
