import { Suit, Tile, TileType } from "mahjong/dist/src/core";

const prefix = "https://upload.wikimedia.org/wikipedia/commons/";

// https://en.wikipedia.org/wiki/Mahjong_tiles#Contents
export const getTileImage = (tile: Tile): string | null => {
  switch (tile.type) {
    case TileType.Suit: {
      switch (tile.suit) {
        case Suit.Dots: {
          switch (tile.value) {
            case 1:
              return prefix + "b/b3/MJt1-.svg";
            case 2:
              return prefix + "a/a4/MJt2-.svg";
            case 9:
              return prefix + "f/f5/MJt9-.svg";
          }
        }
        case Suit.Bamboo: {
          switch (tile.value) {
            case 4:
              return prefix + "b/b1/MJs4-.svg";
          }
        }
      }
    }
  }

  return null;
};
