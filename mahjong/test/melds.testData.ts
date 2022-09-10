import { Suit, TileType, Tile, Wind, Flower } from "../src/tiles";

export const pungTilesFixture = [
  [
    [
      {
        suit: Suit.Dots,
        type: TileType.Suit,
        value: 1,
      },
      {
        suit: Suit.Dots,
        type: TileType.Suit,
        value: 1,
      },
      {
        suit: Suit.Dots,
        type: TileType.Suit,
        value: 1,
      },
    ],
    true,
  ],
  [
    [
      {
        suit: Suit.Dots,
        type: TileType.Suit,
        value: 1,
      },
      {
        suit: Suit.Dots,
        type: TileType.Suit,
        value: 2,
      },
      {
        suit: Suit.Dots,
        type: TileType.Suit,
        value: 1,
      },
    ],
    // Not all the same value
    false,
  ],
  // Honors are valid pungs
  [
    Array.from({ length: 3 }).map(() => {
      return {
        type: TileType.Wind,
        value: Wind.North,
      };
    }),
    true,
  ],
  // Bonus are never valid pungs
  [
    Array.from({ length: 3 }).map(() => {
      return {
        type: TileType.Flower,
        value: Flower.Bamboo,
      };
    }),
    false,
  ],
] as [[Tile, Tile, Tile], boolean][];

export const chowTilesFixture = [
  [
    Array.from({ length: 3 }).map((_, index) => ({
      suit: Suit.Dots,
      type: TileType.Suit,
      value: index + 1,
    })),
    true,
    null,
  ],
  [
    Array.from({ length: 3 }).map((_, index) => ({
      suit: Suit.Dots,
      type: TileType.Suit,
      value: index + 1,
    })),
    true,
    -1,
  ],
  [
    Array.from({ length: 3 }).map((_, index) => ({
      suit: Suit.Dots,
      type: TileType.Suit,
      value: index + 1,
    })),
    false,
    1,
  ],
  [
    Array.from({ length: 3 }).map(() => ({
      suit: Suit.Dots,
      type: TileType.Suit,
      value: 1,
    })),
    false,
    null,
  ],
] as [[Tile, Tile, Tile], boolean, number | null][];
