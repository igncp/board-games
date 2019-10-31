import { ALL_CARDS } from "../constants";
import { Card, CardColor } from "../types";

const isCard = (opts: Partial<Card>) => (card: Card): boolean => {
  return Object.keys(opts).every((key: any) => {
    return (card as any)[key] === (opts as any)[key];
  });
};

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
