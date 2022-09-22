import { getPossibleMeldsInGame } from "../src/game";
import { chowGame01 } from "./gamesFixtures/chowGame01";

describe("Functional tests", () => {
  it("Returns a meld chow for the game - Originally it was 0", () => {
    const melds = getPossibleMeldsInGame(chowGame01);

    expect(melds).toEqual([
      {
        discardTile: null,
        playerId: chowGame01.players[0].id,
        tiles: [99, 73, 74],
      },
    ]);
  });
});
