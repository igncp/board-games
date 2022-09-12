import { createRound, Round } from "../src/round";
import {
  Suit,
  TileType,
  Tile,
  Wind,
  Flower,
  HandTile,
  Deck,
} from "../src/tiles";

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
  [
    [
      {
        type: TileType.Wind,
        value: Wind.West,
      },
      {
        type: TileType.Wind,
        value: Wind.West,
      },
      {
        suit: Suit.Dots,
        type: TileType.Suit,
        value: 7,
      },
    ],
    false,
  ],
] as [[Tile, Tile, Tile], boolean][];

export const kongTilesFixture = [
  [
    [
      {
        type: TileType.Wind,
        value: Wind.West,
      },
      {
        type: TileType.Wind,
        value: Wind.West,
      },
      {
        suit: Suit.Dots,
        type: TileType.Suit,
        value: 7,
      },
      {
        suit: Suit.Dots,
        type: TileType.Suit,
        value: 7,
      },
    ],
    false,
  ],
] as [[Tile, Tile, Tile, Tile], boolean][];

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
    1,
  ],
  [
    Array.from({ length: 3 }).map((_, index) => ({
      suit: Suit.Dots,
      type: TileType.Suit,
      value: index + 1,
    })),
    false,
    -1,
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

export const possibleMeldsFixture = [
  [
    Array.from({ length: 4 }).map((_, id) => {
      return {
        concealed: true,
        id,
        setId: null,
      };
    }),
    createRound(),
    Array.from({ length: 4 }).reduce<Deck>((acc, _, id) => {
      acc[id] = {
        id,
        suit: Suit.Dots,
        type: TileType.Suit,
        value: 2,
      };
      return acc;
    }, {} as Deck),
    0,
    [
      [0, 1, 2],
      [0, 1, 2, 3],
      [0, 1, 3],
      [0, 2, 3],
      [1, 2, 3],
    ],
  ],
] as [HandTile[], Round, Deck, number, number[][]][];

export const pairsFixture = [
  [
    Array.from({ length: 2 }).map((_, id) => ({
      id,
      suit: Suit.Dots,
      type: TileType.Suit,
      value: 3,
    })),
    true,
  ],
  [
    Array.from({ length: 2 }).map((_, id) => ({
      id,
      type: TileType.Flower,
      value: Flower.Chrysanthemum,
    })),
    true,
  ],
  [
    Array.from({ length: 2 }).map((_, id) => ({
      id,
      type: TileType.Flower,
      value: id === 0 ? Flower.Chrysanthemum : Flower.Bamboo,
    })),
    false,
  ],
  [
    Array.from({ length: 1 }).map((_, id) => ({
      id,
      suit: Suit.Dots,
      type: TileType.Suit,
    })),
    false,
  ],
] as [Tile[], boolean][];
