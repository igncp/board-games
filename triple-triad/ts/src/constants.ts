type PlayerId = number;

type CardId = number;

type CardCopyUid = string;

type CardReference = {
  cardId: CardId;
  cardCopyUid: CardCopyUid;
};

enum CardElement {
  Earth = "EARTH",
  Fire = "FIRE",
  Holy = "HOLY",
  Ice = "ICE",
  Neutral = "NEUTRAL",
  Poison = "POISON",
  Thunder = "THUNDER",
  Water = "WATER",
  Wind = "WIND"
}

enum RankIndex {
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3
}

/**
 * The Open and Random rules are delegated to the consumer client, so it is not
 * necessary to be used in the code
 */
enum SpecialRule {
  Elemental = "Elemental",
  Open = "Open",
  Plus = "Plus",
  Random = "Random",
  Same = "Same",
  SameWall = "SameWall",
  SuddenDeath = "SuddenDeath"
}

enum TradeRule {
  All = "All",
  Difference = "Difference",
  Direct = "Direct",
  One = "One"
}

type Card = {
  id: CardId;
  name: string;
  level: number;
  element: CardElement;
  ranks: [number, number, number, number];
};

type Player = {
  allCards: CardReference[];
  gameCards: CardReference[];
  id: PlayerId;
  wonCards: CardCopyUid[];
};

type BoardSlot = {
  cardReference: CardReference | null;
  cardPlayer: Player["id"] | null;
  element: CardElement | null;
};

type Board = {
  slots: BoardSlot[][];
};

type Turn = {
  playerId: PlayerId;
};

enum GamePhase {
  Playing = "PLAYING",
  End = "END"
}

type Game = {
  board: Board;
  phase: GamePhase;
  players: Player[];
  specialRules: SpecialRule[];
  tradeRule: TradeRule;
  turn: Turn;
  usedCards: Card[];
};

type SlotPosition = {
  row: number;
  column: number;
};

enum Region {
  Balamb = "Balamb",
  Centra = "Centra",
  Dollet = "Dollet",
  Esthar = "Esthar",
  FH = "FH",
  Galbadia = "Galbadia",
  Lunar = "Lunar",
  Trabia = "Trabia"
}

type RegionToSpecialRulesMap = { [str in Region]: SpecialRule[] };

const regionToSpecialRulesMap: RegionToSpecialRulesMap = {
  [Region.Balamb]: [SpecialRule.Open],
  [Region.Centra]: [SpecialRule.Same, SpecialRule.Plus, SpecialRule.Random],
  [Region.Dollet]: [SpecialRule.Random, SpecialRule.Elemental],
  [Region.Esthar]: [SpecialRule.Elemental, SpecialRule.SameWall],
  [Region.FH]: [SpecialRule.Elemental, SpecialRule.SuddenDeath],
  [Region.Galbadia]: [SpecialRule.Same],
  [Region.Lunar]: [
    SpecialRule.Same,
    SpecialRule.Plus,
    SpecialRule.Elemental,
    SpecialRule.SameWall,
    SpecialRule.Random,
    SpecialRule.SuddenDeath
  ],
  [Region.Trabia]: [SpecialRule.Random, SpecialRule.Plus]
};

export {
  Board,
  BoardSlot,
  Card,
  CardCopyUid,
  CardElement,
  CardId,
  CardReference,
  Game,
  GamePhase,
  Player,
  RankIndex,
  Region,
  SlotPosition,
  SpecialRule,
  TradeRule,
  regionToSpecialRulesMap
};
