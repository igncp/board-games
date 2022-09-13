import { calculateHandScore } from "../src/score";
import { Opts, scoreFixture } from "./score.testData";

describe("calculateHandScore", () => {
  test.each(scoreFixture)(
    "Returns the expected value %#",
    (partialOpts, expected) => {
      const score = {
        playerA: 0,
      };
      const opts = {
        ...partialOpts,
        score,
        winnerPlayer: "playerA",
      } as Opts;
      calculateHandScore(opts);
      expect(opts.score.playerA).toBe(expected);
    }
  );
});
