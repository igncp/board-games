import { createGame } from "../src/game";
import { GamePhase, moveRoundAfterWin } from "../src/round";
import { roundsFixture } from "./round.testData";

describe("moveRoundAfterWin", () => {
  test.each(roundsFixture)(
    "Updates to the next expected round %#",
    (initialRound, finalRound, phase) => {
      const game = createGame();

      game.round = initialRound;
      game.phase = GamePhase.Playing;

      moveRoundAfterWin(game);

      expect(game.round).toEqual(finalRound);
      expect(game.phase).toEqual(phase);
    }
  );
});
