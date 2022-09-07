import { Deck, SuitTile, Tile } from "./tiles";

type SetCheckOpts = {
  subHand: Tile["id"][];
  deck: Deck;
};

// - Pung: http://mahjong.wikidot.com/pung
export const getIsPung = ({ subHand, deck }: SetCheckOpts) => {
  if (subHand?.length !== 3) return false;

  let lastTileId = subHand[0];
  for (let tileIndex = 1; tileIndex < 3; tileIndex += 1) {
    const tileId = subHand[tileIndex];
    const lastTile = deck[lastTileId] as SuitTile;
    const tile = deck[tileId];

    if (
      !tile ||
      !("suit" in tile) ||
      lastTile.suit !== tile.suit ||
      lastTile.value !== tile.value
    ) {
      return false;
    }

    lastTileId = tile.id;
  }

  return true;
};

// - Chow: http://mahjong.wikidot.com/chow
export const getIsChow = ({ subHand, deck }: SetCheckOpts) => {
  if (subHand?.length !== 3) return false;

  let lastTileId = subHand[0];
  for (let tileIndex = 1; tileIndex < 3; tileIndex += 1) {
    const tileId = subHand[tileIndex];
    const lastTile = deck[lastTileId] as SuitTile;
    const tile = deck[tileId];

    if (
      !tile ||
      !("suit" in tile) ||
      lastTile.suit !== tile.suit ||
      lastTile.value + 1 !== tile.value
    ) {
      return false;
    }

    lastTileId = tile.id;
  }

  return true;
};

// - Kong: http://mahjong.wikidot.com/kong
