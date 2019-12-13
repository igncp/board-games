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
  players: Player[];
  phase: GamePhase;
  turn: Turn;
  usedCards: Card[];
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
  RankIndex
};
