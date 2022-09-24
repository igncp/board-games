export enum TileType {
  Suit = "suit",
  Wind = "wind",
  Dragon = "dragon",
  Flower = "flower",
  Season = "season",
}

export enum Flower {
  Bamboo = "bamboo",
  Chrysanthemum = "chrysanthemum",
  Orchid = "orchid",
  Plum = "plum",
}

export enum Season {
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

export type Deck = Record<Tile["id"], Tile>;

export enum GamePhase {
  Beginning = "beginning",
  End = "end",
  Playing = "playing",
}

export type Round = {
  dealerPlayerIndex: number;
  playerIndex: number;
  tileClaimed: {
    by: Player["id"] | null;
    from: Player["id"];
    id: Tile["id"];
  } | null;
  type: Wind;
  wallTileDrawn: null | Tile["id"];
};

// http://mahjongtime.com/Chinese-Official-Mahjong-Scoring.html
// http://mahjongtime.com/scoring-chart.html
export type Score = Record<Player["id"], number>;

export type Player = {
  id: string;
  name: string;
};

export type HandTile = {
  concealed: boolean;
  id: Tile["id"];
  setId: string | null;
};

export type Table = {
  board: Tile["id"][];
  drawWall: Tile["id"][];
  hands: Record<Player["id"], HandTile[]>;
};

export type Game = {
  deck: Deck;
  id: string;
  name: string;
  phase: GamePhase;
  players: Player[];
  round: Round;
  score: Score;
  table: Table;
};
