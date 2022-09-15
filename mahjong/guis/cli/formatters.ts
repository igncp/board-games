import { Suit, Tile, TileType } from "../../src/core";
import { getIsSuitTile } from "../../src/tiles";

export const formatToEmoji = (tile: Tile) => {
  if (getIsSuitTile(tile)) {
    switch (tile.suit) {
      case Suit.Bamboo: {
        return "🎋" + tile.value;
      }
      case Suit.Characters: {
        return "✨" + tile.value;
      }
      case Suit.Dots: {
        return "💠" + tile.value;
      }
    }
  }
  const initial = tile.value[0].toUpperCase();

  if (tile.type === TileType.Wind) {
    return "🍃" + initial;
  }
  if (tile.type === TileType.Dragon) {
    return "🐉" + initial;
  }
  if (tile.type === TileType.Flower) {
    return "💮" + initial;
  }
  if (tile.type === TileType.Season) {
    return "🌞" + initial;
  }

  return JSON.stringify(tile);
};
