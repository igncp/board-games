import { createRound } from "../src/round";
import { calculateHandScore } from "../src/score";
import { Deck, Dragon, Flower, Suit, Tile, TileType } from "../src/tiles";

export type Opts = Parameters<typeof calculateHandScore>[0];

const createHandTile = (concealed: boolean, setId: string | null) => ({
  concealed,
  setId,
});

const addId = (item: ReturnType<typeof createHandTile>, idx: number) => {
  return {
    ...item,
    id: idx,
  };
};

const createDeckGeneralTile = (
  type: Tile["type"],
  value: Tile["value"],
  suit?: Suit
) => ({
  type,
  value,
  ...(suit && { suit }),
});

const reduceToId = (
  deck: Deck,
  item: ReturnType<typeof createDeckGeneralTile>,
  idx: number
) => {
  (item as Tile).id = idx;
  deck[idx] = item as Tile;
  return deck;
};

export const scoreFixture = [
  [
    {
      deck: [
        createDeckGeneralTile(TileType.Dragon, Dragon.Red),
        createDeckGeneralTile(TileType.Dragon, Dragon.Red),
        createDeckGeneralTile(TileType.Dragon, Dragon.Red),

        createDeckGeneralTile(TileType.Dragon, Dragon.White),
        createDeckGeneralTile(TileType.Dragon, Dragon.White),
        createDeckGeneralTile(TileType.Dragon, Dragon.White),

        createDeckGeneralTile(TileType.Dragon, Dragon.Green),
        createDeckGeneralTile(TileType.Dragon, Dragon.Green),
        createDeckGeneralTile(TileType.Dragon, Dragon.Green),

        createDeckGeneralTile(TileType.Suit, 1, Suit.Bamboo),
        createDeckGeneralTile(TileType.Suit, 1, Suit.Bamboo),
        createDeckGeneralTile(TileType.Suit, 1, Suit.Bamboo),

        createDeckGeneralTile(TileType.Flower, Flower.Plum),
        createDeckGeneralTile(TileType.Flower, Flower.Plum),
      ].reduce(reduceToId, {}),
      hand: [
        createHandTile(true, "0"),
        createHandTile(true, "0"),
        createHandTile(true, "0"),

        createHandTile(true, "1"),
        createHandTile(true, "1"),
        createHandTile(true, "1"),

        createHandTile(true, "2"),
        createHandTile(true, "2"),
        createHandTile(true, "2"),

        createHandTile(true, "3"),
        createHandTile(true, "3"),
        createHandTile(true, "3"),

        createHandTile(true, null),
        createHandTile(true, null),
      ].map(addId),
      round: createRound(),
    },
    // 1 for each flower: 2
    // 3 dragon pungs * 2: 6
    // 4 pungs: 6
    // Not winning by claiming a tile: 1
    15,
  ],
] as [Partial<Opts>, number][];
