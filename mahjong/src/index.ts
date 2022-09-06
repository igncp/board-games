// https://www.mahjongtime.com/hong-kong-mahjong-rules.html
// http://mahjong.wikidot.com/

export enum TileType {
  Suit = "suit",
  Wind = "wind",
  Dragon = "dragon",
  Flower = "flower",
  Season = "season",
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
  GreenDragon = "green-dragon",
  RedDragon = "red-dragon",
  WhiteDragon = "white-dragon",
}
// -----------

enum RoundType {
  East = "east",
  North = "north",
  South = "south",
  West = "west",
}

// Sets:
// - Pung: http://mahjong.wikidot.com/pung
// - Chow: http://mahjong.wikidot.com/pung
// - Kong: http://mahjong.wikidot.com/kong

type Player = any;

type Game = {
  deck: any[];
  players: Player[];
  round: RoundType;
  score: any;
};

const createPlayer = (): Player => {
  return {};
};

const createGame = (): Game => {
  return {
    deck: [],
    players: Array.from({ length: 4 }).map(createPlayer),
    round: RoundType.East,
    score: {},
  };
};

export { createGame };
