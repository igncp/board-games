import { Deck } from "../src/core";
import {
  getIsChow,
  getIsKong,
  getIsPair,
  getIsPung,
  getPossibleMelds,
} from "../src/melds";
import {
  chowTilesFixture,
  kongTilesFixture,
  pairsFixture,
  possibleMeldsFixture,
  pungTilesFixture,
} from "./melds.testData";

describe("getIsPung", () => {
  test.each(pungTilesFixture)(
    "Returns the expected result on combinations: %#",
    (tiles, isPung) => {
      const tilesWithId = tiles.map((t, id) => ({ ...t, id }));
      const deck = tilesWithId.reduce((deck, tile) => {
        deck[tile.id] = tile;
        return deck;
      }, {} as Deck);
      const subHand = tilesWithId.map((t) => t.id);

      expect(getIsPung({ subHand, deck, boardTilePlayerDiff: null })).toEqual(
        isPung
      );
    }
  );
});

describe("getIsChow", () => {
  test.each(chowTilesFixture)(
    "Returns the expected result on combinations: %#",
    (tiles, isChow, boardTilePlayerDiff) => {
      const tilesWithId = tiles.map((t, id) => ({ ...t, id }));
      const deck = tilesWithId.reduce((deck, tile) => {
        deck[tile.id] = tile;
        return deck;
      }, {} as Deck);
      const subHand = tilesWithId.map((t) => t.id);

      expect(getIsChow({ subHand, deck, boardTilePlayerDiff })).toEqual(isChow);
    }
  );
});

describe("getIsKong", () => {
  test.each(kongTilesFixture)(
    "Returns the expected result on combinations: %#",
    (tiles, isKong) => {
      const tilesWithId = tiles.map((t, id) => ({ ...t, id }));
      const deck = tilesWithId.reduce((deck, tile) => {
        deck[tile.id] = tile;
        return deck;
      }, {} as Deck);
      const subHand = tilesWithId.map((t) => t.id);

      expect(getIsKong({ subHand, deck, boardTilePlayerDiff: null })).toEqual(
        isKong
      );
    }
  );
});

describe("getPossibleMelds", () => {
  test.each(possibleMeldsFixture)(
    "Returns the expected result on combinations: %#",
    (hand, round, deck, boardTilePlayerDiff, expectedResult) => {
      expect(
        getPossibleMelds({ hand, round, boardTilePlayerDiff, deck })
      ).toEqual(expectedResult);
    }
  );
});

describe("getIsPair", () => {
  test.each(pairsFixture)(
    "Returns the expected result on combinations: %#",
    (hand, expectedResult) => {
      expect(getIsPair({ hand })).toEqual(expectedResult);
    }
  );
});
