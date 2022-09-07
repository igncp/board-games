import { getIsChow, getIsPung } from "../src/sets";
import { Suit, SuitTile, TileType } from "../src/tiles";

describe("getIsPung", () => {
  const dummyTile: SuitTile = {
    id: 1,
    suit: Suit.Dots,
    type: TileType.Suit,
    value: 1,
  };

  const defaultOpts = {
    subHand: [1, 2, 3],
    deck: {
      1: dummyTile,
      2: { ...dummyTile, id: 2 },
      3: { ...dummyTile, id: 3 },
    },
  };

  test("Returns true on 3 idential suits", () => {
    expect(getIsPung(defaultOpts)).toEqual(true);
  });

  test("Returns false when different items even if the same suit", () => {
    expect(
      getIsPung({
        ...defaultOpts,
        deck: {
          ...defaultOpts.deck,
          3: { ...defaultOpts.deck[3], value: 2 },
        },
      })
    ).toEqual(false);
  });
});

describe("getIsChow", () => {
  const dummyTile: SuitTile = {
    id: 1,
    suit: Suit.Dots,
    type: TileType.Suit,
    value: 1,
  };

  const defaultOpts = {
    subHand: [1, 2, 3],
    deck: {
      1: dummyTile,
      2: { ...dummyTile, id: 2, value: 2 },
      3: { ...dummyTile, id: 3, value: 3 },
    },
  };

  test("Returns true on 3 consecutive suits", () => {
    expect(getIsChow(defaultOpts)).toEqual(true);
  });

  test("Returns false when not consecutive even if the same suit", () => {
    expect(
      getIsChow({
        ...defaultOpts,
        deck: {
          ...defaultOpts.deck,
          3: { ...defaultOpts.deck[3], value: 2 },
        },
      })
    ).toEqual(false);
  });
});
