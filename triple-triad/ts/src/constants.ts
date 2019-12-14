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
  Random = "Random",
  Same = "Same"
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
  playerId: Player["id"];
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
  SlotPosition,
  SpecialRule,
  TradeRule
};
