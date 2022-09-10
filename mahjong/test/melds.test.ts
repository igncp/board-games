import { getIsChow, getIsPung } from "../src/melds";
import { Deck } from "../src/tiles";
import { chowTilesFixture, pungTilesFixture } from "./melds.testData";

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
