enum TileType {
  Suit = "suit",
  Wind = "wind",
  Dragon = "dragon",
  Flower = "flower",
  Season = "season",
}

enum Flower {
  Bamboo = "bamboo",
  Chrysanthemum = "chrysanthemum",
  Orchid = "orchid",
  Plum = "plum",
}

enum Season {
  Autumn = "autumn",
  Spring = "spring",
  Summer = "summer",
  Winter = "winter",
}

export enum Suit {
  Bamboo = "bamboo",
  Characters = "characters",
  Dots = "dots",
}

// Honours ----
export enum Wind {
  East = "east",
  North = "north",
  South = "south",
  West = "west",
}

export enum Dragon {
  Green = "green",
  Red = "red",
  White = "white",
}
// -----------

type BaseTile = {
  id: number;
};

export type SuitTile = BaseTile & {
  suit: Suit;
  type: TileType.Suit;
  value: number;
};

export type WindTile = BaseTile & {
  type: TileType.Wind;
  value: Wind;
};

export type DragonTile = BaseTile & {
  type: TileType.Dragon;
  value: Dragon;
};

export type FlowerTile = BaseTile & {
  type: TileType.Flower;
  value: Flower;
};

export type SeasonTile = BaseTile & {
  type: TileType.Season;
  value: Season;
};

export type Tile = SuitTile | WindTile | DragonTile | FlowerTile | SeasonTile;

type Deck = Record<Tile["id"], Tile>;
type TileWithoutId = Omit<Tile, "id">;

const getDefaultDeck = (): Deck => {
  return Array.from({ length: 4 })
    .reduce(
      (deck: TileWithoutId[]) => {
        const suitsSet = [Suit.Bamboo, Suit.Dots, Suit.Characters]
          .reduce((subDeck, suit) => {
            const suitSeries: TileWithoutId[] = Array.from({ length: 9 }).map(
              (_, index) => {
                return {
                  suit,
                  type: TileType.Suit,
                  value: index + 1,
                };
              }
            );

            return subDeck.concat(suitSeries);
          }, [] as TileWithoutId[])
          .concat(deck);

        const winds: TileWithoutId[] = Object.values(Wind).map((wind) => {
          return {
            type: TileType.Wind,
            value: wind,
          };
        });

        const dragons: TileWithoutId[] = Object.values(Dragon).map((dragon) => {
          return {
            type: TileType.Dragon,
            value: dragon,
          };
        });

        return suitsSet.concat(winds).concat(dragons);
      },
      [
        ...Object.values(Flower).map((flower) => {
          return {
            type: TileType.Flower,
            value: flower,
          };
        }),
        ...Object.values(Season).map((season) => {
          return {
            type: TileType.Season,
            value: season,
          };
        }),
      ] as Tile[]
    )
    .reduce((deck, tile, id) => {
      deck[id] = {
        ...tile,
        id,
      } as Tile;

      return deck;
    }, {} as Deck);
};

export { getDefaultDeck, Deck, TileType };
