import { GamePhase, HandTile } from "../src/core";
import { moveRoundAfterWin, continueRound } from "../src/round";
import { continueRoundFixture, moveRoundFixture } from "./round.testData";

describe("moveRoundAfterWin", () => {
  test.each(moveRoundFixture)(
    "Updates to the next expected round %#",
    (initialRound, finalRound, phase) => {
      const game = { round: initialRound, phase: GamePhase.Playing };

      moveRoundAfterWin(game);

      expect(game.round).toEqual(finalRound);
      expect(game.phase).toEqual(phase);
    }
  );
});

describe("continueRound", () => {
  test.each(continueRoundFixture)(
    "Loops through the four players %#",
    (initialRound, finalRound) => {
      const hands = [Array.from({ length: 13 })] as HandTile[][];
      continueRound(initialRound, hands);

      expect(initialRound).toEqual(finalRound);
    }
  );
});
