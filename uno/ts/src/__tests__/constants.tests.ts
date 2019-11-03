import { ALL_CARDS } from "../constants";
import { isCard } from "../gameHelpers";
import { CardColor } from "../types";

describe("ALL_CARDS", () => {
  it("has the expected cards", () => {
    expect(ALL_CARDS.length).toEqual(108);

    [CardColor.Yellow, CardColor.Red, CardColor.Blue, CardColor.Green].forEach(
      color => {
        expect(ALL_CARDS.filter(isCard({ color })).length).toEqual(25);
      }
    );
  });
});
