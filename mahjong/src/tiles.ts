import {
  Deck,
  Dragon,
  DragonTile,
  Flower,
  FlowerTile,
  HandTile,
  Season,
  SeasonTile,
  Suit,
  SuitTile,
  Tile,
  TileType,
  Wind,
  WindTile,
} from "./core";

type TileWithoutId = Omit<Tile, "id">;

export const getDefaultDeck = (): Deck => {
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

export const getIsSuitTile = (tile: Tile): tile is SuitTile => {
  return tile.type === TileType.Suit && "suit" in tile;
};

export const getIsHonorTile = (tile: Tile): tile is WindTile | DragonTile => {
  return tile.type === TileType.Dragon || tile.type === TileType.Wind;
};

export const getIsBonusTile = (tile: Tile): tile is FlowerTile | SeasonTile => {
  return tile.type === TileType.Flower || tile.type === TileType.Season;
};

export const sortTileByValue = (tileA: Tile, tileB: Tile) => {
  if (typeof tileA.value === "number" && typeof tileB.value === "number") {
    return tileA.value - tileB.value;
  }

  return tileA.value.toString().localeCompare(tileB.value.toString());
};

export const getTileSorter =
  (deck: Deck) => (handTileA: HandTile, handTileB: HandTile) => {
    const tileA = deck[handTileA.id];
    const tileB = deck[handTileB.id];

    if (tileA.type === tileB.type) {
      if (
        getIsSuitTile(tileA) &&
        getIsSuitTile(tileB) &&
        tileA.suit !== tileB.suit
      ) {
        return tileA.suit.localeCompare(tileB.suit);
      }

      return sortTileByValue(tileA, tileB);
    }

    if (tileA.type === TileType.Suit && tileB.type !== TileType.Suit) return 1;
    if (tileB.type === TileType.Suit && tileA.type !== TileType.Suit) return -1;

    return tileA.type.localeCompare(tileB.type);
  };
